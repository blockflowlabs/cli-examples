# Uniswap v2 Indexing

This project demonstrates how to index Uniswap v2 data using Blockflow CLI. Uniswap is a decentralized protocol for automated token exchange on Ethereum. By indexing Uniswap v2 data, we can track and analyze liquidity pools, token swaps, and overall protocol statistics.

## Key Features

- Index Uniswap v2 factory and pair contract events
- Track liquidity additions and removals
- Monitor token swaps and price changes
- Analyze protocol-wide statistics and individual pair performance

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
mkdir uniswap-v2-indexing && cd uniswap-v2-indexing
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: uniswapV2
description: "Uniswap is a decentralized protocol for automated token exchange on Ethereum."
startBlock: 10008355
userId: [Your User ID]
projectId: [Your Project ID]
network: Ethereum
user: [Your Username]
schema:
  file: ./studio.schema.ts
Resources:
  - Name: factory
    Abi: src/abis/factory.json
    Type: contract/event
    Address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    Triggers:
      - Event: PairCreated(address indexed,address indexed,address,uint256)
        Handler: src/factory/index.PairCreatedHandler
  - Name: pair
    Abi: src/abis/pair.json
    Type: contract/event
    Address:
      file: pairs.json
    Triggers:
      - Event: Burn(address indexed,uint256,uint256,address indexed)
        Handler: src/pair/Burn/index.BurnHandler
      - Event: Mint(address indexed,uint256,uint256)
        Handler: src/pair/Mint/index.MintHandler
      - Event: Swap(address indexed,uint256,uint256,uint256,uint256,address indexed)
        Handler: src/pair/Swap/index.SwapHandler
      - Event: Sync(uint112,uint112)
        Handler: src/pair/Sync/index.SyncHandler
      - Event: Transfer(address indexed,address indexed,uint256)
        Handler: src/pair/Transfer/index.TransferHandler
```

## Schema Setup

Create `studio.schema.ts` in your project root with the provided schema. Here's a summary of the key interfaces:

```typescript
import { String, Array } from "@blockflow-labs/utils";

interface Pair {
  id: String;
  token0: String;
  token1: String;
  reserve0: String;
  reserve1: String;
  totalSupply: String;
  reserveETH: String;
  reserveUSD: String;
  trackedReserveETH: String;
  token0Price: String;
  token1Price: String;
  volumeToken0: String;
  volumeToken1: String;
  volumeUSD: String;
  untrackedVolumeUSD: String;
  txCount: String;
  createdAtTimestamp: String;
  createdAtBlockNumber: Number;
  liquidityProviderCount: String;
}

interface Token {
  id: String;
  symbol: String;
  name: String;
  decimals: String;
  totalSupply: String;
  tradeVolume: String;
  tradeVolumeUSD: String;
  untrackedVolumeUSD: String;
  txCount: String;
  totalLiquidity: String;
  derivedETH: String;
}

// Additional interfaces: UniswapFactory, Bundle, Transaction, Swap, Burn, Mint, etc.
```

Generate TypeScript types:

```bash
blockflow typegen
```

## Implementing Handlers

Create handler files for each event. Here's an example for the Sync event:

```typescript
import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";
import { getEthPriceInUSD, getTrackedLiquidityUSD, findEthPerToken } from "../price";
import { ZERO_BI, FACTORY_ADDRESS, convertTokenToDecimal } from "../helper";
import { Pair, Bundle, Token, UniswapFactory, TokenToPair } from "../../types/schema";

export const SyncHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: any
) => {
  const { event, log } = context;
  let { reserve0, reserve1 } = event;

  // Update pair reserves
  const pairDB: Instance = bind(Pair);
  let pair = await pairDB.findOne({ id: log.log_address.toLowerCase() });
  pair.reserve0 = convertTokenToDecimal(reserve0, token0.decimals);
  pair.reserve1 = convertTokenToDecimal(reserve1, token1.decimals);

  // Update token prices
  pair.token0Price = new BigNumber(pair.reserve1).div(pair.reserve0).toString();
  pair.token1Price = new BigNumber(pair.reserve0).div(pair.reserve1).toString();

  // Update ETH price and derived amounts
  const bundleDB: Instance = bind(Bundle);
  let bundle = await bundleDB.findOne({ id: "1" });
  bundle.ethPrice = await getEthPriceInUSD(pairDB);
  await bundleDB.save(bundle);

  // Update tracked liquidity
  let trackedLiquidityETH = getTrackedLiquidityUSD(pair, bundle.ethPrice);
  pair.trackedReserveETH = trackedLiquidityETH;
  pair.reserveETH = calculateReserveETH(pair, token0, token1);
  pair.reserveUSD = new BigNumber(pair.reserveETH).times(bundle.ethPrice).toString();

  // Update global liquidity
  const factoryDB: Instance = bind(UniswapFactory);
  let uniswap = await factoryDB.findOne({ id: FACTORY_ADDRESS.toLowerCase() });
  uniswap.totalLiquidityETH = new BigNumber(uniswap.totalLiquidityETH)
    .plus(trackedLiquidityETH)
    .toString();
  uniswap.totalLiquidityUSD = new BigNumber(uniswap.totalLiquidityETH)
    .times(bundle.ethPrice)
    .toString();

  // Save updated entities
  await pairDB.save(pair);
  await factoryDB.save(uniswap);
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

### Pair

- Represents a Uniswap v2 liquidity pool
- Tracks reserves, prices, and volume for the pair

### Token

- Represents an individual token in the Uniswap ecosystem
- Monitors total liquidity, volume, and derived ETH price

### UniswapFactory

- Tracks global statistics for the Uniswap v2 protocol
- Manages total liquidity and volume across all pairs

## Best Practices

- Regularly update the ABIs for the factory and pair contracts to ensure compatibility with any protocol upgrades.
- Implement proper error handling in handler functions to manage potential issues with event data.
- Optimize database queries and indexes for efficient retrieval of large datasets.

## Troubleshooting

- If you're missing events, check that your `startBlock` in `studio.yaml` is set correctly (Uniswap v2 was deployed at block 10008355 on Ethereum mainnet).
- For performance issues, consider optimizing your database queries and indexing frequently accessed fields.
- If you encounter issues with price calculations, ensure that the price oracle functions are correctly implemented and updated.
- Verify that the `pairs.json` file contains all the necessary pair addresses for comprehensive indexing.


## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [Uniswap v2 Documentation](https://docs.uniswap.org/contracts/v2/overview)
- [Uniswap v2 Whitepaper](https://uniswap.org/whitepaper.pdf)
