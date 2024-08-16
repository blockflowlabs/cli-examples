# ERC-4337 (Account Abstraction) Indexing

This project demonstrates how to index ERC-4337 (Account Abstraction) data using Blockflow CLI. ERC-4337 introduces account abstraction to Ethereum, allowing for more flexible and user-friendly account management. By indexing ERC-4337 data, we can track and analyze user operations, account deployments, and bundler activities.

## Key Features

- Index User Operations and their execution results
- Track Account deployments and factory statistics
- Monitor Bundler and Paymaster activities
- Analyze transaction and block data related to ERC-4337

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
mkdir erc4337-indexing && cd erc4337-indexing
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: ERC4337
description: Indexing UserOps from an Entry Point Contract
startBlock: 17012204
userId: [Your User ID]
projectId: [Your Project ID]
network: Ethereum
user: [Your Username]
schema:
  file: ./studio.schema.ts
Resources:
  - Name: entrypointFunction
    Type: contract/function
    Abi: src/abis/entrypoint.json
    Address: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
    Triggers:
      - Function: handleOps(tuple(address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address)
        Handler: src/entrypoint/handleOps/index.handleOps
  - Name: entrypointEvents
    Abi: src/abis/entrypoint.json
    Type: contract/event
    Address: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
    Triggers:
      - Event: UserOperationEvent(bytes32 indexed,address indexed,address indexed,uint256,bool,uint256,uint256)
        Handler: src/entrypoint/UserOperationEvent/index.UserOperationEventHandler
      - Event: UserOperationRevertReason(indexed bytes32,indexed address,uint256,bytes)
        Handler: src/entrypoint/UserOperationRevertReason/index.UserOperationRevertReasonHandler
      - Event: AccountDeployed(indexed bytes32,indexed address,address,address)
        Handler: src/entrypoint/AccountDeployed/index.AccountDeployedHandler
  # Add API configurations here
```

## Schema Setup

Create `studio.schema.ts` in your project root with the provided schema. Here's a summary of the key interfaces:

```typescript
import { Array } from "@blockflow-labs/utils";

interface UserOperation {
  id: String; // userOp hash
  txHash: String;
  block: String;
  bundler: String;
  sender: String;
  paymaster: String;
  nonce: Number;
  success: Boolean;
  actualGasCost: Number;
  actualGasUsed: Number;
  // Additional fields...
}

interface Account {
  id: String;
  ops: [String];
  paymaster: String;
  createdAt: String;
  updatedAt: String;
  totalOperations: String;
  factory: String;
}

interface Bundler {
  id: String;
  ops: [String];
  createdAt: String;
  updatedAt: String;
  totalOperations: String;
  gasCollected: String;
}

// Additional interfaces: Transaction, Block, AccountFactory, Blockchain, Paymaster, UserOperationRevertReason
```

Generate TypeScript types:

```bash
blockflow typegen
```

## Implementing Handlers

Create handler files for each event and function. Here's an example for the AccountDeployed event:

```typescript
import { BigNumber } from "bignumber.js";
import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import {
  Blockchain,
  Paymaster,
  AccountFactory,
  Account,
  IPaymaster,
  IBlockchain,
  IAccountFactory,
  IAccount,
} from "../../types/schema";

export const AccountDeployedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: any,
) => {
  const { event, transaction, block } = context;
  let { userOpHash, sender, factory, paymaster } = event;
  
  // Update Blockchain stats
  await updateBlockchain(bind(Blockchain));
  
  // Update Paymaster data
  await updatePaymaster(bind(Paymaster), block.block_timestamp, paymaster, userOpHash);
  
  // Update AccountFactory data
  await updateAccountFactory(bind(AccountFactory), factory, sender);
  
  // Create or update Account
  const accountDB: Instance = bind(Account);
  let account: IAccount = await accountDB.findOne({ id: sender.toLowerCase() });
  account ??= await accountDB.create({
    id: sender.toLowerCase(),
    factory: factory.toLowerCase(),
    paymaster: paymaster.toLowerCase(),
    totalOperations: "0",
    createdAt: block.block_timestamp,
    createdHash: transaction.transaction_hash,
    createdOpHash: userOpHash,
  });
  account.updatedAt = block.block_timestamp;
  await accountDB.save(account);
};

// Implement helper functions: updateBlockchain, updatePaymaster, updateAccountFactory
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

### UserOperation

- Represents individual user operations
- Tracks execution status, gas costs, and related metadata

### Account

- Stores information about deployed accounts
- Tracks operations, creation details, and associated factory

### Bundler

- Monitors bundler activities
- Tracks operations processed and gas collected

### Paymaster

- Records paymaster usage and gas sponsorship

## Best Practices

- Regularly update the EntryPoint contract ABI to ensure compatibility with the latest ERC-4337 implementations.
- Implement proper error handling in handler functions to manage potential issues with event data.
- Consider implementing a caching layer for frequently accessed data to improve query performance.
- Set up alerts for significant changes in user operation patterns or unusual account deployments.

## Troubleshooting

- If you're missing user operations, check that your `startBlock` in `studio.yaml` is set correctly (ERC-4337 was deployed at block 17012204 on Ethereum mainnet).
- For performance issues, consider optimizing your database queries and indexing frequently accessed fields.
- If you encounter issues with parsing user operation data, ensure that the `handleOps` function handler is up to date with the latest ERC-4337 specifications.

## Contributing

[Guidelines for contributing to the project]

## License

[Specify the license under which this project is released]

## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [ERC-4337 Specification](https://eips.ethereum.org/EIPS/eip-4337)
- [Account Abstraction Resources](https://ethereum.org/en/developers/docs/accounts/#account-abstraction)
