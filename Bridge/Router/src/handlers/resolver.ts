import { nitroProjectId } from "../config";
import { Source } from "../types/schema";
import { nitroFilterTransformer, nitroSortTransformer } from "../utils/gql";
import { nitroSchema } from "../utils/nitroSchema";
import { convertToOldNitroTxn } from "../utils/nitroTransformers";

export function testResolvers(bind: any) {
  try {
    const resolvers: any = {
      Query: {},
    };

    for (const [collectionName, collectionSchema] of Object.entries(
      nitroSchema
    )) {
      resolvers.Query[collectionName] = async (_: any, args: any) => {
        let where: any = {};
        let sort: any = {};
        let options: any = {};
        const schema_: any = {};
        collectionSchema.forEach((sch) => {
          schema_[sch.name] = { type: sch.type };
        });
        console.log("args", args);
        if (args.sort) {
          sort = nitroSortTransformer(args.sort);
          console.log("newSort", sort);
        }

        if (args.where) {
          if (collectionName === "findNitroTransactionsByFilter") {
            where = { transactionHash: args.hash };
          } else {
            where = nitroFilterTransformer(args.where);
          }
          console.log("where", where);
        }

        if (!args.limit) {
          if (collectionName === "findNitroTransactionsByFilter") {
            args.limit = 1;
          } else {
            args.limit = 10;
          }
        }

        if (!args.page) {
          args.page = 1;
        }

        const api = bind(Source);
        console.log("options", options);
        const records = await api.aggregate([
          {
            $match: where,
          },
          {
            $sort: Object.keys(sort).length > 0 ? sort : { blockTimestamp: -1 },
          },
          { $skip: (args.page - 1) * args.limit },
          { $limit: args.limit },
          {
            $lookup: {
              from: nitroProjectId,
              let: { tokenRef: "$sourceToken.tokenRef" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$tokenRef"] },
                        { $eq: ["$entityId", "TokensInfo"] },
                      ],
                    },
                  },
                },
              ],
              as: "sourceToken.fullInfo",
            },
          },
          {
            $lookup: {
              from: nitroProjectId,
              let: { tokenRef: "$destinationToken.tokenRef" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$tokenRef"] },
                        { $eq: ["$entityId", "TokensInfo"] },
                      ],
                    },
                  },
                },
              ],
              as: "destinationToken.fullInfo",
            },
          },
          {
            $lookup: {
              from: nitroProjectId,
              let: { tokenRef: "$stableToken.tokenRef" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$tokenRef"] },
                        { $eq: ["$entityId", "TokensInfo"] },
                      ],
                    },
                  },
                },
              ],
              as: "stableToken.fullInfo",
            },
          },
          {
            $lookup: {
              from: nitroProjectId,
              let: { tokenRef: "$fee.tokenRef" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$tokenRef"] },
                        { $eq: ["$entityId", "TokensInfo"] },
                      ],
                    },
                  },
                },
              ],
              as: "fee.fullInfo",
            },
          },
          {
            $lookup: {
              from: nitroProjectId,
              let: { tokenRef: "$stableDestToken.tokenRef" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$tokenRef"] },
                        { $eq: ["$entityId", "TokensInfo"] },
                      ],
                    },
                  },
                },
              ],
              as: "stableDestToken.fullInfo",
            },
          },
          {
            $lookup: {
              from: nitroProjectId,
              let: { recordRef: "$destination.recordRef" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$recordRef"] },
                        { $eq: ["$entityId", "Destination"] },
                      ],
                    },
                  },
                },
              ],
              as: "destination.fullInfo",
            },
          },
          {
            $unwind: {
              path: "$destination.fullInfo",
              preserveNullAndEmptyArrays: true, // To keep documents without matches
            },
          },
          {
            $lookup: {
              from: nitroProjectId,
              let: {
                tokenRef: "$destination.fullInfo.destinationToken.tokenRef",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$tokenRef"] },
                        { $eq: ["$entityId", "TokensInfo"] },
                      ],
                    },
                  },
                },
              ],
              as: "destination.fullInfo.destinationToken.fullInfo",
            },
          },
          {
            $project: {
              id: 1,
              eventName: 1,
              blockTimestamp: 1,
              blockNumber: 1,
              chainId: 1,
              destChainId: 1,
              transactionHash: 1,
              sourceToken: 1,
              stableToken: 1,
              depositorAddress: 1,
              senderAddress: 1,
              depositId: 1,
              partnerId: 1,
              message: 1,
              usdValue: 1,
              fee: 1,
              stableDestToken: 1,
              recipientAddress: 1,
              competitorData: 1,
              destination: 1,
              withdraw: 1,
            },
          },
        ]);

        if (collectionName === "findNitroTransactionsByFilter") {
          const totalRecordsResult = await api.aggregate([
            {
              $match: where,
            },
            {
              $count: "totalCount",
            },
          ]);
          const totalCount = totalRecordsResult[0]?.totalCount || 0;
          return {
            data: records.map((record: any) =>
              convertToOldNitroTxn(populateFullInfo(record))
            ),
            page: args.page,
            total: totalCount,
            limit: args.limit,
          };
        } else if (collectionName === "findNitroTransactionByFilter") {
          return convertToOldNitroTxn(populateFullInfo(records[0]));
        }
        return records;
      };
    }

    return resolvers;
  } catch (error: any) {
    throw error;
  }
}

function mapToType(fieldType: any, value: any) {
  if (typeof fieldType === "string") {
    if (["String", "string"].includes(fieldType)) {
      return value;
    } else if (["Number", "number"].includes(fieldType)) {
      return Number(value);
    } else if (fieldType === "Boolean") {
      return value === "true" || value === true;
    } else if (fieldType === "Array") {
      return ["String"];
    }
  } else if (
    Array.isArray(fieldType) &&
    fieldType.length > 0 &&
    typeof fieldType[0] === "object"
  ) {
    return value.map((v: any) => mapObjectToType(v, fieldType[0]));
  }

  return value;
}

function mapObjectToType(obj: any, objectSchema: any) {
  const mappedObj: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (objectSchema[key]) {
      mappedObj[key] = mapToType(objectSchema[key].type, val);
    } else {
      mappedObj[key] = val; // Default fallback if schema not found
    }
  }
  return mappedObj;
}

function populateFullInfo(obj: any) {
  // Helper function to process tokens
  function processToken(token: any) {
    if (token && Array.isArray(token.fullInfo) && token.fullInfo.length > 0) {
      // Merge the first item in fullInfo into the token object, and remove fullInfo
      Object.assign(token, token.fullInfo[0]);
      delete token.fullInfo;
    }
  }

  // Process sourceToken
  if (obj.sourceToken) {
    processToken(obj.sourceToken);
  }

  // Process stableToken
  if (obj.stableToken) {
    processToken(obj.stableToken);
  }

  // Process fee
  if (obj.fee) {
    processToken(obj.fee);
  }

  // Process stableDestToken
  if (obj.stableDestToken) {
    processToken(obj.stableDestToken);
  }

  // Process destination
  if (obj.destination && obj.destination.fullInfo) {
    const destFullInfo = obj.destination.fullInfo;
    if (destFullInfo) {
      obj.destination = { ...destFullInfo };
    }
  }

  // Process destinationToken inside destination.fullInfo if present
  if (obj.destination && obj.destination.destinationToken) {
    processToken(obj.destination.destinationToken);
  }

  if (obj.destination && obj.destination.stableToken) {
    processToken(obj.destination.stableToken);
  }

  return obj;
}
