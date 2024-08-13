import crypto from "crypto";
import {
  NitroContractType,
  NitroTransactionFilter,
  NitroTransactionSort,
  NitroTransactionStatus,
  NitroTransactionType,
  SortEnum,
  TransactionType,
} from "./gql-filters-type";
import { EventNameEnum } from "./helper";

/**
 * Converts a GraphQL filter into a MongoDB query object.
 *
 * @param filter The GraphQL filter object.
 * @returns The MongoDB query object.
 */
export function convertToMongoQuery(
  filter: any | undefined,
  parentField: string = ""
): any {
  if (!filter) return {};

  // This function now needs to consider every possibility in the MongoDbGenericFilterInput
  const translate = (key: string, value: any, parentField: string): any => {
    const fullKey = parentField ? `${parentField}.${key}` : key;

    // Handle logical operators separately since they don't directly translate to field queries
    if (["and", "or", "not"].includes(key) && Array.isArray(value)) {
      return { [`$${key}`]: value.map((v) => convertToMongoQuery(v, "")) };
    }

    // Translate comparison and other operators directly
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const subQuery: any = {};
      for (let [subKey, subValue] of Object.entries(value)) {
        subValue = subValue === "null" ? null : subValue;
        if (
          [
            "eq",
            "gt",
            "gte",
            "lt",
            "lte",
            "ne",
            "exists",
            "regex",
            "size",
            "in",
            "nin",
            "all",
          ].includes(subKey)
        ) {
          // For array operators like in, nin, all, ensure the value is an array
          subQuery[`$${subKey}`] =
            subKey === "in" || subKey === "nin" || subKey === "all"
              ? //@ts-ignore
                [].concat(subValue)
              : subValue;
        } else {
          // For any unrecognized key, attempt to process it as a nested query
          Object.assign(
            subQuery,
            convertToMongoQuery({ [subKey]: subValue }, fullKey)
          );
        }
      }
      return { [fullKey]: subQuery };
    }

    // Direct assignment for non-object types or direct field matches
    return { [fullKey]: value };
  };
  return Object.entries(filter).reduce((query, [field, conditions]) => {
    if (field !== "$expr") {
      Object.assign(query, translate(field, conditions, parentField));
    } else {
      Object.assign(query, { [field]: conditions });
    }
    return query;
  }, {});
}

/**
 * Generates a unique cache key based on the filter, page, and pageSize.
 *
 * @param filter The filtering criteria.
 * @param page The current page number.
 * @param pageSize The size of each page.
 * @returns A string representing the unique cache key.
 */
export function generateCacheKey(
  filter: any,
  page: number,
  pageSize: number
): string {
  return crypto
    .createHash("md5")
    .update(JSON.stringify(filter) + `:page=${page}:pageSize=${pageSize}`)
    .digest("hex");
}

export const nitroFilterTransformer = (filter: NitroTransactionFilter) => {
  const newFilter: any = {};
  if (filter?.dest_chain_id) {
    const arrayKeys = ["and", "or", "in", "nin", "all"];
    const key = Object.keys(filter.dest_chain_id)[0];
    if (arrayKeys.includes(key)) {
      newFilter["destChainId"] = {
        //@ts-ignore
        [key]: filter.dest_chain_id[key].map((chainId: string) => chainId),
      };
    } else {
      newFilter["destChainId"] = {
        //@ts-ignore
        [key]: filter.dest_chain_id[key],
      };
    }
  }
  if (filter?.src_chain_id) {
    newFilter["chainId"] = filter?.src_chain_id;
  }
  if (filter?.src_timestamp) {
    newFilter["blockTimestamp"] = filter?.src_timestamp;
  }
  if (filter?.src_tx_hash) {
    newFilter["transactionHash"] = filter?.src_tx_hash;
  }
  if (filter?.sender_address) {
    newFilter["senderAddress"] = filter?.sender_address;
  }
  if (filter?.widget_id) {
    newFilter["partnerId"] = filter?.widget_id;
  }
  if (filter?.status) {
    if (filter?.status?.in) {
      const andFilter: any = [];
      filter?.status?.in?.forEach((status) => {
        if (status === NitroTransactionStatus.completed) {
          andFilter.push({
            destinationTransaction: {
              ne: null,
            },
          });
          andFilter.push({
            type: TransactionType.Dexspan,
          });
        } else if (status === NitroTransactionStatus.failed) {
          andFilter.push({
            destinationTransaction: null,
            depositInfoUpdateTransaction: {
              ne: null,
            },
            type: {
              ne: TransactionType.Dexspan,
            },
          });
        } else if (status === NitroTransactionStatus.pending) {
          andFilter.push({
            destinationTransaction: null,
            depositInfoUpdateTransaction: null,
            type: {
              ne: TransactionType.Dexspan,
            },
          });
        }
      });
      newFilter["or"] = andFilter;
    } else if (filter?.status?.eq) {
      if (filter?.status?.eq === NitroTransactionStatus.completed) {
        newFilter["or"] = [
          {
            destinationTransaction: {
              ne: null,
            },
          },
          {
            type: TransactionType.Dexspan,
          },
        ];
      } else if (filter?.status?.eq === NitroTransactionStatus.failed) {
        newFilter["destinationTransaction"] = null;
        newFilter["depositInfoUpdateTransaction"] = {
          ne: null,
        };
        newFilter["type"] = {
          ne: TransactionType.Dexspan,
        };
      } else if (filter?.status?.eq === NitroTransactionStatus.pending) {
        newFilter["destinationTransaction"] = null;
        newFilter["depositInfoUpdateTransaction"] = null;
        newFilter["type"] = {
          ne: TransactionType.Dexspan,
        };
      }
    }
  }
  if (filter?.transaction_type) {
    if (
      filter?.transaction_type.toLowerCase() ===
      NitroTransactionType.with_instruction
    ) {
      newFilter["name"] = {
        in: [
          EventNameEnum.FundsDepositedWithMessage,
          EventNameEnum.TokenTransferWithInstruction,
        ],
      };
    } else if (
      filter?.transaction_type.toLowerCase() ===
      NitroTransactionType.without_instruction
    ) {
      newFilter["name"] = {
        nin: [
          EventNameEnum.FundsDepositedWithMessage,
          EventNameEnum.TokenTransferWithInstruction,
        ],
      };
    } else if (
      filter?.transaction_type.toLowerCase() === NitroTransactionType.gastopup
    ) {
      newFilter["destinationTransaction.inputs.nativeTokenAmount"] = {
        nin: ["", null],
      };
    }
  }
  if (filter?.flow_type) {
    if (filter?.flow_type.toLowerCase() === NitroContractType.asset_forwarder) {
      newFilter["type"] = TransactionType.AssetForwarder;
    } else if (
      filter?.flow_type.toLowerCase() === NitroContractType.asset_bridge
    ) {
      newFilter["type"] = TransactionType.AssetBridge;
    } else if (filter?.flow_type.toLowerCase() === NitroContractType.circle) {
      newFilter["type"] = TransactionType.CircleUSDC;
    } else if (
      filter?.flow_type.toLowerCase() === NitroContractType.same_chain
    ) {
      newFilter["type"] = TransactionType.Dexspan;
    }
  }
  if (filter?.is_Crosschain) {
    newFilter["type"] = { nin: [TransactionType.Dexspan] };
  }
  if (filter?.usdc_value) {
    if (filter?.usdc_value?.gt) {
      newFilter["$expr"] = {
        $gt: [{ $toDouble: "$inputs.usdValue" }, filter?.usdc_value?.gt],
      };
    } else if (filter?.usdc_value?.gte) {
      newFilter["$expr"] = {
        $gte: [{ $toDouble: "$inputs.usdValue" }, filter?.usdc_value?.gte],
      };
    } else if (filter?.usdc_value?.lte) {
      newFilter["$expr"] = {
        $lte: [{ $toDouble: "$inputs.usdValue" }, filter?.usdc_value?.lte],
      };
    } else if (filter?.usdc_value?.lt) {
      newFilter["$expr"] = {
        $lt: [{ $toDouble: "$inputs.usdValue" }, filter?.usdc_value?.lt],
      };
    } else {
      newFilter["inputs.usdValue"] = filter?.usdc_value;
    }
  }
  return newFilter;
};

export const nitroSortTransformer = (sort: NitroTransactionSort) => {
  const newSort: any = {};
  if (sort?.src_timestamp) {
    if (sort?.src_timestamp === SortEnum.asc) {
      newSort["timestamp"] = 1;
    } else if (sort?.src_timestamp === SortEnum.desc) {
      newSort["timestamp"] = -1;
    }
  }
  return newSort;
};
