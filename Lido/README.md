# Lido Finance Indexing

This project demonstrates how to index Lido Finance data using Blockflow CLI. Lido Finance is a liquid staking solution for Ethereum, allowing users to stake ETH and earn rewards while maintaining liquidity through staked ETH tokens (stETH). By indexing Lido Finance data, we can gain valuable insights into the protocol's operations, user activities, and overall performance.

## Key Features

- Index user deposits and withdrawals
- Track share transfers and balances
- Monitor fee configurations and distributions
- Capture oracle operations and validator information
- Analyze reward distributions and staking metrics

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

Create a new project directory:

```bash
mkdir lido-finance-indexing && cd lido-finance-indexing
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: Lido Finance
description: Indexing Lido Finance protocol data
startBlock: 11473216
userId: [Your User ID]
projectId: [Your Project ID]
network: Ethereum
user: [Your Username]
schema:
  file: ./studio.schema.ts
execution: parallel
Resources:
  - Name: lido
    Abi: src/abis/lido.json
    Type: contract/event
    Address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
    Triggers:
      - Event: Submitted(address indexed,uint256,address)
        Handler: src/handlers/lido/submitted/index.SubmittedHandler
      - Event: Transfer(address indexed,address indexed,uint256)
        Handler: src/handlers/lido/transfer/index.TransferHandler
      # Add other events and handlers as needed
  - Name: legacyOracle
    Abi: src/abis/legacyOracle.json
    Type: contract/event
    Address: "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
    Triggers:
      - Event: Completed(uint256,uint128,uint128)
        Handler: src/handlers/legacyOracle/completed/index.CompletedHandler
      # Add other events and handlers as needed
  # Add other contracts (lidoDao, nodeOperatorsRegistry, voting, etc.) as needed
```

## Schema Setup

Create `studio.schema.ts` in your project root with the provided schema. Here's a snippet of the schema structure:

```typescript
import { String, Array } from "@blockflow-labs/utils";

export interface LidoSubmission {
  id: String;
  sender: string;
  amount: string;
  referral: string;
  shares: string;
  // ... other fields
}

export interface LidoTransfer {
  id: String;
  from: string;
  to: string;
  value: string;
  // ... other fields
}

// Add other interfaces as provided in the schema file
```

Generate TypeScript types:

```bash
blockflow typegen
```

## Generating Handlers

Generate handler templates:

```bash
blockflow codegen
```

Implement the logic for each handler. For example, the Submitted event handler:

```typescript
import { LidoSubmission } from "../../../types/schema";

export const SubmittedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  const { event, transaction, block, log } = context;
  const { sender, amount, referral } = event;

  const lidoSubmissionDB = bind(LidoSubmission);

  const submission = await lidoSubmissionDB.create({
    id: `${transaction.transaction_hash}-${log.log_index}`,
    sender,
    amount: amount.toString(),
    referral,
    // ... populate other fields
    block_timestamp: block.block_timestamp,
    transaction_hash: transaction.transaction_hash,
    log_index: log.log_index,
  });

  await lidoSubmissionDB.save(submission);
};
```

## Testing

Before deploying your Instance, it's crucial to test the handler code thoroughly. Blockflow CLI provides robust testing capabilities to validate your indexing and data transformation logic.

### Local MongoDB Setup (Recommended)

1. Set up a local MongoDB instance following the official MongoDB installation guide.

2. Run the test command:

```bash
blockflow instance-test --rpc "your-rpc-endpoint"
```

Replace "your-rpc-endpoint" with a valid RPC endpoint for the network your instance is built on.

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

### LidoSubmission

- Represents user deposits to the Lido protocol
- Tracks amount, shares, and total pooled ether before and after the submission

### LidoTransfer

- Captures transfers of stETH tokens
- Monitors changes in user balances and total shares

### LidoOracleReport

- Stores oracle reports on beacon chain status
- Includes total rewards and processed items

### LidoNodeOperator

- Maintains information about node operators
- Tracks staking limits, active status, and total stopped validators

## Best Practices

- Regularly update ABI files to ensure compatibility with the latest Lido contract versions.
- Implement proper error handling in handler functions to manage potential issues with event data.
- Consider implementing a caching layer for frequently accessed data to improve query performance.
- Regularly monitor and optimize database indexes to ensure efficient querying of large datasets.

## Troubleshooting

- If you're missing events, check that your `startBlock` in `studio.yaml` is set correctly (Lido was deployed at block 11473216).
- For performance issues, consider optimizing your database queries and indexing frequently accessed fields.
- If you encounter issues with event parsing, ensure that the ABI files are up to date.


## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [Lido Finance Documentation](https://docs.lido.fi/)
- [Ethereum Developer Resources](https://ethereum.org/en/developers/)
