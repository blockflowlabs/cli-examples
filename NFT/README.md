# NFT Indexing Project

This project demonstrates how to index Non-Fungible Token (NFT) data using Blockflow CLI. By indexing NFT data, we can track and analyze various aspects of NFT collections, including transfers, ownership changes, and collection statistics.

## Key Features

- Index NFT transfers and ownership changes
- Track individual token data within collections
- Monitor collection statistics and daily snapshots
- Analyze account balances and activities

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
mkdir nft-indexing && cd nft-indexing
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: NFT
description: Indexing NFT data
startBlock: latest
userId: [Your User ID]
projectId: [Your Project ID]
network: Ethereum
user: [Your Username]
schema:
  file: ./studio.schema.ts
execution: parallel
Resources:
  - Name: milady
    Abi: src/abis/milady.json
    Type: contract/event
    Address: "0x5Af0D9827E0c53E4799BB226655A1de152A425a5"
    Triggers:
      - Event: Transfer(address indexed,address indexed,uint256 indexed)
        Handler: src/handlers/milady/token.TransferHandler
```

## Schema Setup

Create `studio.schema.ts` in your project root with the provided schema. Here's a summary of the key interfaces:

```typescript
import { String, Array } from "@blockflow-labs/utils";

export interface Token {
  id: String;
  collectionNFT: string;
  tokenId: string;
  tokenURI: string;
  owner: string;
  mintTime: number;
}

export interface CollectionERC721 {
  id: String;
  name: string;
  symbol: string;
  tokenCount: number;
  ownerCount: number;
  transferCount: number;
}

export interface Transfer {
  id: String;
  fromAddress: string;
  toAddress: string;
  tokenAddress: string;
  tokenId: string;
  transferType: string; // mint, burn, transfer
  transactionHash: string;
  logIndex: string;
  blockTimestamp: string;
  blockHash: string;
}

// Additional interfaces: CollectionDailySnapshot, Account, AccountBalance, AccountDailySnapshot
```

Generate TypeScript types:

```bash
blockflow typegen
```

## Implementing the Handler

Create the handler file `src/handlers/milady/token.ts` with the following content:

```typescript
import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { Token, IToken } from "../../types/schema";
import { CollectionERC721, ICollectionERC721 } from "../../types/schema";
import { Transfer, ITransfer } from "../../types/schema";
import { getTokenMetadata } from "../../utils/tokens";

export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context;
  const { from, to, tokenId } = event;
  
  const tokenAddress = log.log_address.toString();
  const fromAddress = from.toString();
  const toAddress = to.toLowerCase();
  const GENESIS_ADDRESS = "0x0000000000000000000000000000000000000000";
  
  const tokenDB: Instance = bind(Token);
  const collectionDB: Instance = bind(CollectionERC721);
  const transferDB: Instance = bind(Transfer);

  // Update Token
  let token: IToken = await tokenDB.findOne({ id: tokenId.toString() });
  if (!token) {
    const tokenMetadata = getTokenMetadata(tokenAddress);
    token = await tokenDB.create({
      id: tokenId.toString(),
      collectionNFT: tokenAddress,
      tokenId: tokenId.toString(),
      tokenURI: tokenMetadata.tokenURI,
      owner: toAddress,
      mintTime: block.block_timestamp,
    });
  } else {
    token.owner = toAddress;
  }
  await tokenDB.save(token);

  // Update Collection
  let collection: ICollectionERC721 = await collectionDB.findOne({ id: tokenAddress });
  if (!collection) {
    const tokenMetadata = getTokenMetadata(tokenAddress);
    collection = await collectionDB.create({
      id: tokenAddress,
      name: tokenMetadata.name,
      symbol: tokenMetadata.symbol,
      tokenCount: 1,
      ownerCount: 1,
      transferCount: 1,
    });
  } else {
    collection.transferCount += 1;
    if (fromAddress === GENESIS_ADDRESS) {
      collection.tokenCount += 1;
      collection.ownerCount += 1;
    } else if (toAddress === GENESIS_ADDRESS) {
      collection.tokenCount -= 1;
      collection.ownerCount -= 1;
    }
  }
  await collectionDB.save(collection);

  // Create Transfer
  const transferType = fromAddress === GENESIS_ADDRESS ? "mint" : toAddress === GENESIS_ADDRESS ? "burn" : "transfer";
  await transferDB.create({
    id: `${transaction.transaction_hash}-${log.log_index}`,
    fromAddress,
    toAddress,
    tokenAddress,
    tokenId: tokenId.toString(),
    transferType,
    transactionHash: transaction.transaction_hash,
    logIndex: log.log_index.toString(),
    blockTimestamp: block.block_timestamp.toString(),
    blockHash: block.block_hash,
  });

  // Additional logic for AccountBalance and AccountDailySnapshot can be implemented here
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

### Token

- Represents individual NFTs within a collection
- Tracks ownership and metadata

### CollectionERC721

- Stores collection-level data
- Monitors token count, owner count, and transfer count

### Transfer

- Records individual transfer events
- Distinguishes between mints, burns, and regular transfers

### AccountBalance and AccountDailySnapshot

- Tracks user balances and daily snapshots of NFT holdings

## Best Practices

- Implement proper error handling in the handler function to manage potential issues with event data.
- Consider implementing a caching layer for frequently accessed data to improve query performance.
- Regularly monitor and optimize database indexes to ensure efficient querying of large datasets.

## Troubleshooting

- If you're missing transfers, check that your `startBlock` in `studio.yaml` is set correctly.
- If you encounter issues with token metadata, ensure that the `getTokenMetadata` function is up to date and contains the correct information for all tracked collections.


## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [ERC-721 Token Standard](https://eips.ethereum.org/EIPS/eip-721)
- [Ethereum Developer Resources](https://ethereum.org/en/developers/)
