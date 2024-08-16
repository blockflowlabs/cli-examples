# ERC-20 Token Indexing

This project demonstrates how to index ERC-20 token data using Blockflow CLI. By indexing ERC-20 data, we can track and analyze token transfers, balances, and overall token statistics. This indexer is particularly useful for monitoring token movements, analyzing holder behavior, and providing insights into token economics.

## Key Features

- Index ERC-20 token transfers, including mints and burns
- Track token balances for each holder
- Monitor token-wide statistics
- Analyze holder behavior and token supply changes

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
mkdir erc20-indexing && cd erc20-indexing
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: Project Apollo
description: ERC-20 Token Indexing
startBlock: latest
userId: [Your User ID]
projectId: [Your Project ID]
network: Ethereum
user: [Your Username]
schema:
  file: ./studio.schema.ts
execution: parallel
Resources:
  - Name: erc20
    Abi: src/abis/erc20.json
    Type: contract/event
    Address:
      file: tokens.json
    Triggers:
      - Event: Transfer(address indexed,address indexed,uint256)
        Handler: src/transfer/index.TransferHandler
```

## Schema Setup

Create `studio.schema.ts` in your project root with the following schema:

```typescript
import { String, Number } from "@blockflow-labs/utils";

export interface Transfer {
  id: String;
  from_address: string;
  to_address: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  raw_amount: Number;
  raw_amount_str: string;
  amount: Number;
  amount_str: string;
  usd_amount: Number;
  usd_exchange_rate: string;
  transfer_type: string;
  transaction_from_address: string;
  transaction_to_address: string;
  transaction_hash: string;
  log_index: string;
  block_timestamp: string;
  block_hash: string;
}

export interface Balance {
  id: String;
  address: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  balance: string;
  raw_balance: string;
  usd_amount: string;
  usd_exchange_rate: string;
  block_timestamp: string;
  block_hash: string;
  is_past_holder: boolean;
  is_holder: boolean;
}

export interface Token {
  id: String;
  address: string;
  decimals: string;
  name: string;
  symbol: string;
  holder_count: string;
  burn_event_count: string;
  mint_event_count: string;
  transfer_event_count: string;
  total_supply: string;
  total_burned: string;
  total_minted: string;
  total_transferred: string;
}
```

Generate TypeScript types:

```bash
blockflow typegen
```

## Implementing the Handler

Create the handler file `src/transfer/index.ts` with the following content:

```typescript
import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";
import { getTokenMetadata } from "../utils/tokens";
import { ITransfer, Transfer } from "../types/schema";
import { IBalance, Balance } from "../types/schema";
import { IToken, Token } from "../types/schema";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

export const TransferHandler = async (
  { event, transaction, block, log }: IEventContext,
  bind: IBind,
  _: ISecrets
) => {
  const tokenAddress = log.log_address.toLowerCase();
  const fromAddress = event.from.toLowerCase();
  const toAddress = event.to.toLowerCase();
  const value = event.value.toString();

  const transferType = fromAddress === ZERO_ADDR ? "mint" : toAddress === ZERO_ADDR ? "burn" : "transfer";

  const transferDB: Instance = bind(Transfer);
  const balanceDB: Instance = bind(Balance);
  const tokenDB: Instance = bind(Token);

  // Update Transfer
  const transfer = await updateTransfer(transferDB, tokenAddress, fromAddress, toAddress, value, transferType, transaction, block, log);
  await transferDB.save(transfer);

  // Update Balances
  const senderResult = await updateBalance(balanceDB, tokenAddress, fromAddress, value, block, true);
  const receiverResult = await updateBalance(balanceDB, tokenAddress, toAddress, value, block, false);
  await Promise.all([balanceDB.save(senderResult.user), balanceDB.save(receiverResult.user)]);

  // Update Token
  const holderCountChange = (senderResult.isFirstTimeHolder ? 1 : 0) + (receiverResult.isFirstTimeHolder ? 1 : 0)
    - (senderResult.isActiveHolder ? 0 : 1) - (receiverResult.isActiveHolder ? 0 : 1);
  const token = await updateToken(tokenDB, tokenAddress, value, transferType, holderCountChange.toString());
  await tokenDB.save(token);
};

// Implement updateTransfer, updateBalance, and updateToken functions here
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

### Transfer

- Represents individual token transfers
- Tracks transfer type (mint, burn, or transfer)
- Stores both raw and formatted amounts

### Balance

- Stores token balances for each holder
- Tracks historical and current holder status
- Includes USD value calculations

### Token

- Maintains token-wide statistics
- Monitors total supply, mints, burns, and transfers
- Keeps track of holder count and event counts

## Best Practices

- Implement proper error handling in the handler function to manage potential issues with event data.
- Set up alerts for significant changes in token supply or unusual transfer patterns.
- Optimize database queries and indexes for efficient retrieval of large datasets.
- Implement a mechanism to handle token decimals correctly for accurate balance calculations.

## Troubleshooting

- If you're missing transfers, check that your `startBlock` in `studio.yaml` is set correctly and that the token address is included in `tokens.json`.
- For performance issues, consider optimizing your database queries and indexing frequently accessed fields.
- If you encounter issues with balance calculations, ensure that the `updateBalance` function correctly handles token decimals and edge cases (e.g., mints and burns).
- Verify that the `getTokenMetadata` function in `utils/tokens.ts` is correctly implemented and returns the necessary token information.

## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [ERC-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
- [OpenZeppelin ERC-20 Implementation](https://docs.openzeppelin.com/contracts/4.x/erc20)
