import { Source } from "../types/schema";
import { nitroSchema } from "../utils/nitroSchema";

export function testResolvers(bind: any) {
  try {
    const resolvers: any = {
      Query: {},
    };

    for (const [collectionName, collectionSchema] of Object.entries(
      nitroSchema
    )) {
      resolvers.Query[collectionName] = async (_: any, args: any) => {
        const filter: any = {};
        const options: any = {};
        const schema_: any = {};
        collectionSchema.forEach((sch) => {
          schema_[sch.name] = { type: sch.type };
        });

        if (args.sortBy) {
          for (const [key, order] of Object.entries(args.sortBy) as any) {
            const fieldSchema = collectionSchema.find(
              (field) => field.name === key
            );
            if (!options["sort"]) options["sort"] = {};
            if (fieldSchema) options["sort"][key] = order === "asc" ? 1 : -1;
          }
        }

        if (args.limit) options["limit"] = args.limit;
        if (args.page) options["page"] = args.page;

        filter["entityId"] = collectionName;

        if (args.filter) {
          for (const [key, value] of Object.entries(args.filter) as any) {
            const [fieldName, operator] = key.split("_");
            const fieldSchema = collectionSchema.find(
              (field) => field.name === fieldName
            );
            if (fieldSchema) {
              switch (operator) {
                case undefined:
                  filter[fieldName] = mapToType(fieldSchema.type, value);
                  break;
                case "eq":
                  filter[fieldName] = mapToType(fieldSchema.type, value);
                  break;
                case "lt":
                  filter[fieldName] = {
                    $lt: mapToType(fieldSchema.type, value),
                  };
                  break;
                case "lte":
                  filter[fieldName] = {
                    $lte: mapToType(fieldSchema.type, value),
                  };
                  break;
                case "gt":
                  filter[fieldName] = {
                    $gt: mapToType(fieldSchema.type, value),
                  };
                  break;
                case "gte":
                  filter[fieldName] = {
                    $gte: mapToType(fieldSchema.type, value),
                  };
                  break;
                case "in":
                  filter[fieldName] = {
                    $in: value.map((val: any) =>
                      mapToType(fieldSchema.type, val)
                    ),
                  };
                  break;
                case "nin":
                  filter[fieldName] = {
                    $nin: value.map((val: any) =>
                      mapToType(fieldSchema.type, val)
                    ),
                  };
                  break;
                case "ne":
                  filter[fieldName] = {
                    $ne: mapToType(fieldSchema.type, value),
                  };
                  break;
              }
            }
          }
        }

        const api = bind(Source);
        delete filter.entityId;
        console.log("filter", filter);
        console.log("options", options);
        const data = await api.aggregate([
          {
            $match: {
              transactionHash:
                "0xbd44610b3cab590d26260b8161bf78c5fecf61e8951c790bc76edd1e92071a46",
            },
          },
          {
            $lookup: {
              from: "051429b0-8d48-44b9-bda1-014268440964",
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
              from: "051429b0-8d48-44b9-bda1-014268440964",
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
              from: "051429b0-8d48-44b9-bda1-014268440964",
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
              from: "051429b0-8d48-44b9-bda1-014268440964",
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
              from: "051429b0-8d48-44b9-bda1-014268440964",
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
              from: "051429b0-8d48-44b9-bda1-014268440964",
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
              from: "051429b0-8d48-44b9-bda1-014268440964",
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
          //   {
          //     $addFields: {
          //       "sourceToken.tokenRef": {
          //         $cond: {
          //           if: { $gt: [{ $size: "$sourceToken.tokenInfo" }, 0] },
          //           then: { $arrayElemAt: ["$sourceToken.tokenInfo", 0] },
          //           else: "$sourceToken.tokenRef",
          //         },
          //       },
          //       "destinationToken.tokenRef": {
          //         $cond: {
          //           if: { $gt: [{ $size: "$destinationToken.tokenInfo" }, 0] },
          //           then: { $arrayElemAt: ["$destinationToken.tokenInfo", 0] },
          //           else: "$destinationToken.tokenRef",
          //         },
          //       },
          //       "stableToken.tokenRef": {
          //         $cond: {
          //           if: { $gt: [{ $size: "$stableToken.tokenInfo" }, 0] },
          //           then: { $arrayElemAt: ["$stableToken.tokenInfo", 0] },
          //           else: "$stableToken.tokenRef",
          //         },
          //       },
          //       "fee.tokenRef": {
          //         $cond: {
          //           if: { $gt: [{ $size: "$fee.tokenInfo" }, 0] },
          //           then: { $arrayElemAt: ["$fee.tokenInfo", 0] },
          //           else: "$fee.tokenRef",
          //         },
          //       },
          //       "stableDestToken.tokenRef": {
          //         $cond: {
          //           if: { $gt: [{ $size: "$stableDestToken.tokenInfo" }, 0] },
          //           then: { $arrayElemAt: ["$stableDestToken.tokenInfo", 0] },
          //           else: "$stableDestToken.tokenRef",
          //         },
          //       },
          //     },
          //   },
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
        console.log(
          "DATA",
          populateFullInfo(data[0]),
          "1",
          data[0].destination,
          "2",
          data[0].destination.fullInfo.destinationToken
        );
        return data;
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