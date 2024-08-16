# ERC-721 (Non-Fungible Token) Indexing

This project demonstrates how to index ERC-721 (Non-Fungible Token) data using Blockflow CLI. By indexing ERC-721 data, we can track and analyze NFT transfers, ownership changes, and collection statistics. This indexer is particularly useful for monitoring NFT marketplaces, analyzing token holder behavior, and providing insights into NFT collections.

## Key Features

- Index NFT transfers, including mints and burns
- Track token balances for each holder
- Monitor collection-wide statistics
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
mkdir erc721-indexing && cd erc721-indexing
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: erc721
description: Indexer for ERC-721 tokens
startBlock: 19779702
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
        Handler: src/handlers/index.TransferHandler
```

## Schema Setup

Create `studio.schema.ts` in your project root with the following schema:

```typescript
import { String, Array } from "@blockflow-labs/utils";

export interface Transfer {
  id: String;
  from_address: string;
  to_address: string;
  token_address: string;
  token_id: string;
  transfer_type: string; // mint, burn, transfer
  transaction_from_address: string;
  transaction_to_address: string;
  transaction_hash: string;
  log_index: string;
  block_timestamp: string;
  block_hash: string;
}

export interface Balance {
  id: String; // user address
  address: string; // user address
  token_address: string;
  balance: string; // total NFTs owned
  block_timestamp: string;
  block_hash: string;
  is_past_holder: boolean;
  is_holder: boolean;
}

export interface Token {
  id: String;
  address: string;
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

Create the handler file `src/handlers/index.ts` with the following content:

```typescript
import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";
import { ITransfer, Transfer } from "../types/schema";
import { IBalance, Balance } from "../types/schema";
import { IToken, Token } from "../types/schema";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  const { event, transaction, block, log } = context;
  const { from, to, tokenId } = event;
  const tokenAddress = log.log_address.toLowerCase();
  const fromAddress = from.toLowerCase();
  const toAddress = to.toLowerCase();
  const value = "1"; // ERC-721 always transfers 1 token
  const transferType = fromAddress === ZERO_ADDR ? "mint" : toAddress === ZERO_ADDR ? "burn" : "transfer";

  const transferDB: Instance = bind(Transfer);
  const balanceDB: Instance = bind(Balance);
  const tokenDB: Instance = bind(Token);

  // Update Transfer
  const transfer = await updateTransfer(transferDB, tokenAddress, fromAddress, toAddress, tokenId, transferType, transaction, block, log);
  await transferDB.save(transfer);

  // Update Balances
  const senderResult = await updateBalance(balanceDB, tokenAddress, fromAddress, "-1", block);
  const receiverResult = await updateBalance(balanceDB, tokenAddress, toAddress, "1", block);
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

- Represents individual NFT transfers
- Tracks transfer type (mint, burn, or transfer)

### Balance

- Stores NFT balances for each holder
- Tracks historical and current holder status

### Token

- Maintains collection-wide statistics
- Monitors total supply, mints, burns, and transfers

## Best Practices

- Regularly update the ABI file to ensure compatibility with the latest ERC-721 implementations.
- Implement proper error handling in the handler function to manage potential issues with event data.
- Consider implementing a caching layer for frequently accessed data to improve query performance.
- Set up alerts for significant changes in token supply or unusual transfer patterns.
- Optimize database queries and indexes for efficient retrieval of large datasets.

## Troubleshooting

- If you're missing transfers, check that your `startBlock` in `studio.yaml` is set correctly.
- For performance issues, consider optimizing your database queries and indexing frequently accessed fields.
- If you encounter issues with token balance calculations, ensure that the `updateBalance` function correctly handles edge cases (e.g., mints and burns).

## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [ERC-721 Token Standard](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin ERC-721 Implementation](https://docs.openzeppelin.com/contracts/4.x/erc721)

## Contributing

[Guidelines for contributing to the project]

## License

[Specify the license under which this project is released]
