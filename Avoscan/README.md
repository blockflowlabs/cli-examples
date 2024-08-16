# Avocado Transaction Indexing with Blockflow CLI

## Overview

This project demonstrates how to index transactions on the Avocado ecosystem using Blockflow CLI. Avocado is a next-generation smart contract wallet that enables multi-network transactions with built-in account abstraction, allowing users to perform transactions across multiple networks while connected to a single network.

## Key Features

- Index Avocado transactions across multiple networks
- Track transaction details including broadcaster, network actions, and status
- Simplify queries for Avocado-related transaction data

## Prerequisites

- Node.js v18+
- npm
- MongoDB (for local testing)
- Blockflow CLI 1.0.10

## Installation

Install Blockflow CLI:

```bash
npm i -g @blockflow-labs/cli
```

Verify installation:

```bash
blockflow --version 1.0.10
```

## Project Setup

1. Create a new project directory:

```bash
mkdir avocado-indexing && cd avocado-indexing
```

2. Initialize the project:

```bash
blockflow init
```

3. Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: Avocado Transaction Indexing
description: Indexing Avocado ecosystem transactions
startBlock: [Your Start Block]
userId: [Your User ID]
projectId: [Your Project ID]
network: [Target Network]
user: [Your Username]
schema:
  file: ./studio.schema.ts
Resources:
  - Name: avocado
    Abi: src/abis/avocado.json
    Type: contract/event
    Address: "[Avocado Contract Address]"
    Triggers:
      - Event: Executed(address,address,string,string)
        Handler: src/handlers/avocado/Executed.ExecutedHandler
```

## Schema Setup

Create `studio.schema.ts` in your project root with the following entity:

```typescript
type Action = {
  value: string;
  to: string;
  from: string;
  address: string;
};

export interface avoData {
  id: String;
  transactionHash: string;
  broadcaster: string;
  status: string;
  time: string;
  network: string;
  actions: [Action];
  user: string;
  avocadoWallet: string;
}
```

Generate TypeScript types:

```bash
blockflow typegen
```

## Generating Handlers

1. Generate handler templates:

```bash
blockflow codegen
```

2. Implement the logic for the Executed handler in `src/handlers/avocado/Executed.ts`:

```typescript
import { avoData, IavoData } from "../../types/schema";
import { getAllTransactionActions } from "../../utils";

export const ExecutedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  const { event, transaction, block, log } = context;
  const { avoSafeOwner, avoSafeAddress, source, metadata } = event;

  const avoDataDB: Instance = bind(avoData);
  const id = transaction.transaction_hash + ":" + log.log_index.toString();

  const actions = getAllTransactionActions(transaction.logs);

  await avoDataDB.create({
    id: id,
    transactionHash: transaction.transaction_hash,
    broadcaster: transaction.transaction_from_address,
    status: "Success",
    time: block.block_timestamp.toString(),
    network: "ETH",
    actions,
    user: avoSafeOwner,
    avocadoWallet: avoSafeAddress,
  });
};
```

3. Create `src/utils/index.ts` for utility functions:

```typescript
import { Interface } from "ethers";
import { ILog } from "@blockflow-labs/utils";
import erc20 from "../abis/erc20.json";

const TOPIC_0 = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export function getAllTransactionActions(logs: Array<ILog>) {
  const transferlogs = logs
    ? logs.filter(
        (log) => log.topics[0].toLowerCase() === TOPIC_0.toLowerCase()
      )
    : [];

  return transferlogs.map((log) => {
    const decodedLog: any = decodeTransferLog(log.topics, log.log_data);
    return {
      from: decodedLog[0],
      to: decodedLog[1],
      value: decodedLog[2].toString(),
    };
  });
}

export function decodeTransferLog(topics: Array<string>, data: string) {
  const iface = new Interface(erc20);
  return iface.parseLog({ topics, data })?.args;
}
```

## Testing

Before deploying your Instance, it's crucial to test the handler code thoroughly. Blockflow CLI provides robust testing capabilities to validate your indexing and data transformation logic.

### Local MongoDB Setup (Recommended)

1. Set up a local MongoDB instance following the official MongoDB installation guide.

2. Run the test command:

```bash
blockflow instance-test --rpc "your-rpc-endpoint"
```

Replace `"your-rpc-endpoint"` with a valid RPC endpoint for the network your instance is built on.

### Remote MongoDB Connection

If you prefer using a remote MongoDB instance:

1. Obtain a connection URI for your remote MongoDB instance.

2. Run the test command with the URI:

```bash
blockflow instance-test -uri "your-connection-uri" --rpc "your-rpc-endpoint"
```

## Instance Deployment

Deploy your instance to the Blockflow server:

```bash
blockflow instance-deploy
```

## Querying the Database

After deployment, you can interact with your database using a GraphQL explorer tool:

1. Generate an access key in your Blockflow account.
2. Navigate to the "APIs" section and build a new API.
3. Select "GraphQL API" and click "Start Exploring".
4. Use the Apollo Playground to query your databases and experiment with the GraphQL API.

## Key Components

### avoData
- Represents an Avocado transaction
- Stores information about the transaction, including hash, broadcaster, status, and actions

### ExecutedHandler
- Processes Executed events from the Avocado contract
- Creates avoData records in the database

### Utility Functions
- `getAllTransactionActions`: Extracts transfer actions from transaction logs
- `decodeTransferLog`: Decodes transfer log data

## Best Practices

- Regularly update the ABI file (`src/abis/avocado.json`) to ensure compatibility with the latest Avocado contracts.
- Implement proper error handling in your handler functions to manage potential issues with event data.
- Regularly monitor and optimize your database indexes to ensure efficient querying of large datasets.

## Troubleshooting

- If you're missing transactions, check that your `startBlock` in `studio.yaml` is set correctly.
- If you encounter issues with event parsing, ensure that the ABI in `src/abis/avocado.json` is up to date.

## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [Avocado Documentation](https://docs.avocado.com/)
- [ERC-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
