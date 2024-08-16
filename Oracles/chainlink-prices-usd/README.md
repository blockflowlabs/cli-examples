# Chainlink Oracle Price Feed Indexing

This project demonstrates how to index Chainlink Oracle price feed data using Blockflow CLI. Chainlink is a decentralized oracle network that provides reliable, tamper-proof inputs and outputs for complex smart contracts on any blockchain. By indexing Chainlink Oracle data, we can track and analyze price updates for various assets in real-time.

## Key Features

- Index Chainlink price feed updates
- Track price changes for multiple assets
- Monitor oracle update frequency and roundIds
- Analyze historical price data

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
mkdir chainlink-oracle-indexing && cd chainlink-oracle-indexing
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: chainlink-prices-usd
description: "Chainlink is a decentralized oracle network"
startBlock: 18361281
userId: [Your User ID]
projectId: [Your Project ID]
network: Ethereum
user: [Your Username]
schema:
  file: ./studio.schema.ts
execution: parallel
Resources:
  - Name: eth
    Abi: src/abis/eth.json
    Type: contract/event
    Address:
      file: tokens.json
    Triggers:
      - Event: AnswerUpdated(int256 indexed,uint256 indexed,uint256)
        Handler: src/handlers/eth/index.AnswerUpdatedHandler
```

## Schema Setup

Create `studio.schema.ts` in your project root with the following schema:

```typescript
import { String, Array } from "@blockflow-labs/utils";

export interface PriceDB {
  id: string;
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  quoteCurrency: string;
  rawPrice: string;
  price: string;
}

export interface chainlinkPair {
  id: string;
  updateCount: number;
  transactionHash: string;
  lastBlockNumber: number;
  roundId: number;
}
```

Generate TypeScript types:

```bash
blockflow typegen
```

## Implementing the Handler

Create the handler file `src/handlers/eth/index.ts` with the following content:

```typescript
import { IEventContext, IBind, Instance, ISecrets } from '@blockflow-labs/utils'
import { BigNumber } from 'bignumber.js'
import { getTokenMetadata } from '../../utils/tokens'
import { PriceDB, IPriceDB } from '../../types/schema'
import { chainlinkPair, IchainlinkPair } from '../../types/schema'

export const AnswerUpdatedHandler = async (
  { event, transaction, block, log }: IEventContext,
  bind: IBind,
  _: ISecrets,
) => {
  const contractAddress = log.log_address.toLowerCase()
  const { current, roundId, updatedAt } = event
  const priceDB: Instance = bind(PriceDB)
  const chainlinkPairDB: Instance = bind(chainlinkPair)
  const tokenMetadata = getTokenMetadata(contractAddress)

  const entryId = `${transaction.transaction_hash}-${log.log_index}`.toLowerCase()
  let amount = new BigNumber(current)
    .dividedBy(10 ** tokenMetadata.decimals)
    .toString()

  // Update PriceDB
  let priceEntry: IPriceDB = await priceDB.findOne({ id: entryId })
  priceEntry ??= await priceDB.create({
    id: entryId,
    contractAddress,
    name: tokenMetadata.name,
    symbol: tokenMetadata.symbol,
    decimals: tokenMetadata.decimals,
    quoteCurrency: tokenMetadata.quoteCurrency,
    price: current,
    raw_price: amount,
  })
  await priceDB.save(priceEntry)

  // Update chainlinkPair
  const uniqueId = contractAddress
  let pairData: IchainlinkPair = await chainlinkPairDB.findOne({ id: uniqueId })
  pairData ??= await chainlinkPairDB.create({ id: uniqueId })
  pairData.roundId = roundId
  pairData.transactionHash = transaction.transaction_hash
  pairData.lastBlockNumber = block.block_number
  pairData.updateCount += 1
  await chainlinkPairDB.save(pairData)
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

### PriceDB

- Stores individual price updates for each asset
- Includes raw price and formatted price data

### chainlinkPair

- Tracks metadata for each Chainlink price feed
- Monitors update frequency and latest round information

## Best Practices

- Implement proper error handling in the handler function to manage potential issues with event data.
- Regularly monitor and optimize database indexes to ensure efficient querying of large datasets.
- Set up alerts for significant price changes or unusual update patterns.

## Troubleshooting

- If you're missing price updates, check that your `startBlock` in `studio.yaml` is set correctly.
- For performance issues, consider optimizing your database queries and indexing frequently accessed fields.
- If you encounter issues with token metadata, ensure that the `getTokenMetadata` function is up to date and contains the correct information for all tracked assets.


## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [Chainlink Documentation](https://docs.chain.link/)
- [Ethereum Developer Resources](https://ethereum.org/en/developers/)
