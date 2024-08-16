# USDE (USD Ethena) Credit-Debit Indexing

This project demonstrates how to create a credit-debit data tracking system for the USDE (USD Ethena) ERC-20 token using Blockflow CLI. This approach offers enhanced security, transparency, and facilitates seamless audits and reconciliations for financial transactions on the blockchain.

## Key Features

- Track credit and debit transactions for USDE token
- Enhanced security and transparency for financial transactions
- Seamless audits and reconciliations
- Permanent and accessible transaction records

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

Configure Blockflow CLI:

```bash
blockflow configure
```

## Project Setup

Create a new project directory:

```bash
mkdir usde-credit-debit && cd usde-credit-debit
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: USDE Credit-Debit Tracking
description: Credit-Debit tracking for USDE token using Blockflow CLI
startBlock: latest
userId: [Your User ID]
projectId: [Your Project ID]
network: Ethereum
user: [Your Username]
schema:
  file: ./studio.schema.ts
execution: parallel
Resources:
  - Name: blockflow
    Abi: src/abis/blockflow.json
    Type: contract/event
    Address: "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3"
    Triggers:
      - Event: Transfer(address indexed,address indexed,uint256)
        Handler: src/handlers/blockflow/Transfer.TransferHandler
```

## Schema Setup

Create `studio.schema.ts` in your project root with the following entity:

```typescript
export interface ERC20Table {
  id: String;
  address: string;
  counterPartyAddress: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  rawAmount: number;
  rawAmountString: string;
  amount: string;
  amountString: string;
  usdValue: number;
  usdExchangeRate: number;
  transactionHash: string;
  logIndex: number;
  blockTimestamp: string;
  blockNumber: number;
  blockHash: string;
}
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

Implement the logic for the Transfer handler in `src/handlers/blockflow/Transfer.ts`:

```typescript
import { ERC20Table, IERC20Table } from "../../types/schema";
import BigNumber from "bignumber.js";
import { getTokenMetadata } from "../../utils/ERC20Metadata";

export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context;
  const { from, to, value } = event;

  const uniqueIdcredit = `${transaction.transaction_hash}-${log.log_index}-"credit"`;
  const uniqueIddebit = `${transaction.transaction_hash}-${log.log_index}-"debit"`;

  const tokenMetadata = getTokenMetadata(log.log_address);
  const decimalsBigNumber = new BigNumber(tokenMetadata.decimals);
  const divisionValue = new BigNumber(10).pow(decimalsBigNumber);
  const valueBigNumber = new BigNumber(value.toString());
  const amount = valueBigNumber.dividedBy(divisionValue).toString();
  const debitAmount = valueBigNumber.dividedBy(divisionValue).times(-1).toString();

  const erc20CreditDebitDB: Instance = bind(ERC20Table);

  // Create credit entry
  let creditEntry: IERC20Table = await erc20CreditDebitDB.findOne({
    id: uniqueIdcredit,
  });

  creditEntry ??= await erc20CreditDebitDB.create({
    id: uniqueIdcredit,
    address: to,
    counterPartyAddress: from,
    tokenAddress: log.log_address,
    tokenName: tokenMetadata.tokenName,
    tokenSymbol: tokenMetadata.tokenSymbol,
    rawAmount: value,
    rawAmountString: value.toString(),
    amount: amount,
    amountString: amount.toString(),
    transactionHash: transaction.transaction_hash,
    logIndex: log.log_index,
    blockTimestamp: block.block_timestamp,
    blockNumber: block.block_number,
    blockHash: block.block_hash,
  });

  await erc20CreditDebitDB.save(creditEntry);

  // Create debit entry (similar to credit, but with from/to swapped and negative amount)
  // ...
};
```

Create `src/utils/ERC20Metadata.ts` for token metadata:

```typescript
interface TokenInfo {
  decimals: number;
  tokenName: string;
  tokenSymbol: string;
}

export const TOKENS: Record<string, TokenInfo> = {
  "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3": {
    decimals: 6,
    tokenName: "USD Ethena",
    tokenSymbol: "USDE",
  },
};

export const getTokenMetadata = (token: string) => {
  const findedToken = Object.keys(TOKENS).filter(
    (tokenAddr) => tokenAddr.toLowerCase() === token.toLowerCase(),
  );
  return TOKENS[findedToken[0]];
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

### ERC20Table

- Represents both credit and debit entries for USDE token transfers
- Stores detailed information about each transfer, including amounts, addresses, and block data

### TransferHandler

- Processes Transfer events from the USDE token contract
- Creates both credit and debit entries for each transfer

### ERC20Metadata

- Stores and provides metadata for the USDE token

## Best Practices

- Regularly update the ABI file (`src/abis/blockflow.json`) to ensure compatibility with the latest USDE token contract.
- Implement proper error handling in your handler function to manage potential issues with event data.
- Regularly monitor and optimize your database indexes to ensure efficient querying of large datasets.

## Troubleshooting

- If you're missing transactions, check that your `startBlock` in `studio.yaml` is set correctly.
- For performance issues, consider optimizing your database queries and indexing frequently accessed fields.

## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [USDE Token Information](https://ethena.fi/)
- [ERC-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)

