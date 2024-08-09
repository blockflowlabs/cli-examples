import { nitroSchema } from "../utils/nitroSchema";

export function testTypeDefs() {
  try {
    let typeDefs = `
    scalar ObjectId

    type Query {
      ${Object.keys(nitroSchema)
        .map(
          (collectionName) => `
          ${collectionName}(
            where: ${collectionName}WhereInput
            sort: ${collectionName}SortInput
            limit: Int
            page: Int
          ): ${collectionName === "findNitroTransactionsByFilter" ? "NitroTransactionList" : `[${collectionName}]`}
        `
        )
        .join("\n")}
    }
  `;

    let objectTypes = ""; // To store generated object types definitions
    let inputTypes = ""; // To store generated input types definitions

    for (const [collectionName, collectionSchema] of Object.entries(
      nitroSchema
    ) as any) {
      // Generate object types for nested object fields
      for (const field of collectionSchema) {
        if (typeof field.type === "object") {
          if (!Array.isArray(field.type)) {
            const fieldName = field.name;
            objectTypes += generateObjectType(
              field.type,
              `${collectionName}_${fieldName}`
            );
          } else if (
            Array.isArray(field.type) &&
            typeof field.type[0] === "object"
          ) {
            const typeName = `${collectionName}_${field.name}Type`;
            objectTypes += generateObjectType(field.type[0], typeName);
          }
        }
      }

      if (collectionName === "findNitroTransactionsByFilter") {
        // Add NitroTransactionList type
        typeDefs += `
        type NitroTransactionList {
          data: [NitroTransaction!]!
          limit: Float!
          page: Float!
          total: Float!
        }

        type NitroTransaction {
          ${collectionSchema
            .map((field: { type: any[]; name: any }) => {
              let fieldType = getGraphQLType(
                field.type,
                field.name,
                collectionName
              );
              return `${field.name}: ${fieldType}`;
            })
            .join("\n")}
        }

        input NitroTransactionFilter {
          widget_id: String
          dest_chain_id: MongoDbGenericFilterInput
          flow_type: NitroContractType
          is_crosschain: Boolean
          sender_address: String
          src_chain_id: MongoDbGenericFilterInput
          src_timestamp: MongoDbGenericFilterInput
          src_tx_hash: String
          status: MongoStatusFilterInput
          transaction_type: NitroTransactionType
          usdc_value: MongoDbGenericFilterInput
        }

        input MongoDbGenericFilterInput {
          all: [String!]
          and: [MongoDbGenericFilterInput!]
          eq: String
          exists: Boolean
          gt: Float
          gte: Float
          in: [String!]
          lt: Float
          lte: Float
          ne: String
          nin: [String!]
          not: MongoDbGenericFilterInput
          or: [MongoDbGenericFilterInput!]
          regex: String
          size: Float
        }

        input MongoStatusFilterInput {
          eq: NitroTransactionStatus
          in: [NitroTransactionStatus!]
        }

        enum NitroTransactionStatus {
          pending
          completed
          failed
        }

        enum NitroContractType {
          asset_forwarder
          asset_bridge
          circle
          same_chain
        }

        enum NitroTransactionType {
          TYPE_X
          TYPE_Y
          TYPE_Z
        }

        input ${collectionName}WhereInput {
          widget_id: String
          dest_chain_id: MongoDbGenericFilterInput
          flow_type: NitroContractType
          is_crosschain: Boolean
          sender_address: String
          src_chain_id: MongoDbGenericFilterInput
          src_timestamp: MongoDbGenericFilterInput
          src_tx_hash: String
          status: MongoStatusFilterInput
          transaction_type: NitroTransactionType
          usdc_value: MongoDbGenericFilterInput
        }

        input ${collectionName}SortInput {
          ${collectionSchema
            .map((field: { name: any }) => `${field.name}: SortOrder`)
            .join("\n")}
        }
      `;
      } else {
        typeDefs += `
        type ${collectionName} {
          ${collectionSchema
            .map((field: { type: any[]; name: any }) => {
              let fieldType = getGraphQLType(
                field.type,
                field.name,
                collectionName
              );
              return `${field.name}: ${fieldType}`;
            })
            .join("\n")}
        }
  
        input ${collectionName}WhereInput {
          ${collectionSchema
            .map((field: { type: any[]; name: any }) => {
              if (
                Array.isArray(field.type) &&
                typeof field.type[0] === "object"
              ) {
                const inputTypeName = `${collectionName}_${field.name}WhereInput`;
                inputTypes += generateInputTypeForArrayOfObjects(
                  field.type[0],
                  inputTypeName
                );
                return `
                  ${field.name}: ${inputTypeName}
                  ${field.name}_some: ${inputTypeName}
                  ${field.name}_none: ${inputTypeName}
                  ${field.name}_every: ${inputTypeName}
                `;
              } else if (
                typeof field.type === "object" &&
                !Array.isArray(field.type)
              ) {
                const inputTypeName = `${collectionName}_${field.name}WhereInput`;
                inputTypes += generateInputType(field.type, inputTypeName);
                return `
                  ${field.name}: ${inputTypeName}
                  ${field.name}_eq: ${inputTypeName}
                  ${field.name}_ne: ${inputTypeName}
                  ${field.name}_in: [${inputTypeName}]
                  ${field.name}_nin: [${inputTypeName}]
                `;
              } else {
                const fieldType = getGraphQLType(
                  field.type,
                  field.name,
                  collectionName
                );
                return `
                  ${field.name}: ${fieldType}
                  ${field.name}_eq: ${fieldType}
                  ${field.name}_lt: ${fieldType}
                  ${field.name}_lte: ${fieldType}
                  ${field.name}_gt: ${fieldType}
                  ${field.name}_gte: ${fieldType}
                  ${field.name}_in: [${fieldType}]
                  ${field.name}_nin: [${fieldType}]
                  ${field.name}_ne: ${fieldType}
                `;
              }
            })
            .join("\n")}
        }
  
        input ${collectionName}SortInput {
          ${collectionSchema
            .map((field: { name: any }) => `${field.name}: SortOrder`)
            .join("\n")}
        }
      `;
      }
    }

    typeDefs += `
    enum SortOrder {
      asc
      desc
    }
  `;

    typeDefs += objectTypes;
    typeDefs += inputTypes;

    return typeDefs;
  } catch (error: any) {
    throw error;
  }
}

function generateInputTypeForArrayOfObjects(
  obj: { [s: string]: unknown } | ArrayLike<unknown>,
  typeName: string | undefined
) {
  try {
    let inputFields = Object.entries(obj)
      .map(([fieldName, fieldType]) => {
        const graphqlType = getGraphQLType(fieldType, fieldName, typeName);
        // For each field, generate standard filter operations
        return `
        ${fieldName}: ${graphqlType}
        ${fieldName}_eq: ${graphqlType}
        ${fieldName}_ne: ${graphqlType}
        ${fieldName}_in: [${graphqlType}]
        ${fieldName}_nin: [${graphqlType}]
        ${fieldName}_lt: ${graphqlType}
        ${fieldName}_lte: ${graphqlType}
        ${fieldName}_gt: ${graphqlType}
        ${fieldName}_gte: ${graphqlType}
      `;
      })
      .join("\n");

    // Additionally, for arrays of objects, you might want to support some kind of "contains" operation,
    // where you can query if any object in the array matches certain criteria.
    // This can be more complex and specific to your application's needs.

    let inputTypeDef = `
      input ${typeName} {
        ${inputFields}
      }
    `;

    // Optionally, you might want to add operations like "_some", "_none", "_every"
    // to support queries that check if some, none, or every item in the array match the given criteria.
    // This would be a more advanced feature and might look something like this:
    // inputTypeDef += `
    //   ${typeName}_some: ${typeName}
    //   ${typeName}_none: ${typeName}
    //   ${typeName}_every: ${typeName}
    // `;

    return inputTypeDef;
  } catch (error: any) {
    throw error;
  }
}

function generateObjectType(obj: any, typeName: string) {
  try {
    let objectTypeDef = `
    type ${typeName} {
      ${Object.entries(obj)
        .map(
          ([fieldName, fieldType]) =>
            `${fieldName}: ${getGraphQLType(
              fieldType,
              typeName + "_" + fieldName
            )}`
        )
        .join("\n")}
    }
  `;

    // Recursively handle nested objects
    for (const [fieldName, fieldType] of Object.entries(obj)) {
      if (typeof fieldType === "object" && !Array.isArray(fieldType)) {
        objectTypeDef += generateObjectType(
          fieldType,
          `${typeName}_${fieldName}`
        );
      }
    }

    return objectTypeDef;
  } catch (error: any) {
    throw error;
  }
}

function generateInputType(obj: any, typeName: string) {
  try {
    let inputTypeDef = `
    input ${typeName} {
      ${Object.entries(obj)
        .map(
          ([fieldName, fieldType]) =>
            `${fieldName}: ${getGraphQLType(
              fieldType,
              typeName + "_" + fieldName
            )}`
        )
        .join("\n")}
    }
  `;

    // Recursively handle nested objects
    for (const [fieldName, fieldType] of Object.entries(obj)) {
      if (typeof fieldType === "object" && !Array.isArray(fieldType)) {
        inputTypeDef += generateInputType(
          fieldType,
          `${typeName}_${fieldName}`
        );
      }
    }

    return inputTypeDef;
  } catch (error: any) {
    throw error;
  }
}

function getGraphQLType(type: unknown, fieldName: string, parentName = "") {
  try {
    switch (typeof type) {
      case "string":
        // Handle base types
        return mapBaseType(type);
      case "object":
        if (Array.isArray(type)) {
          // Handle array types
          if (typeof type[0] === "object") {
            // Generate a unique name for array of objects
            const typeName = `${parentName}_${fieldName}Type`;
            return `[${typeName}]`; // Use brackets to denote an array of this new type
          } else {
            // Handle array of simple types
            const elementType = mapBaseType(type[0]);
            return `[${elementType}]`;
          }
        } else {
          // Handle single object types
          // For a standalone object, generate a unique type name based on its usage context
          const typeName = `${parentName}_${fieldName}Type`;
          return typeName;
        }
      default:
        return "String";
    }
  } catch (error: any) {
    throw error;
  }
}

function mapBaseType(type: string) {
  switch (type.toLowerCase()) {
    case "string":
      return "String";
    case "[string]":
      return "[String]";
    case "number":
      return "Float";
    case "[number]":
      return "[Float]";
    case "boolean":
      return "Boolean";
    case "[boolean]":
      return "[Boolean]";
    case "objectid":
      return "ID";
    case "Array":
      return "[String]";
    default:
      return "String";
  }
}
