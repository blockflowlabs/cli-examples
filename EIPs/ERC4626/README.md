# ERC-4626 Indexing

This project demonstrates how to index ERC-4626 data using Blockflow CLI. ERC-4626 is a new Ethereum standard designed to improve tokenized vaults, making the process of creating and managing yield-bearing vaults more efficient and standardized.

## Key Features of ERC-4626

- Standardized interface for tokenized yield-bearing vaults
- Improved interoperability between DeFi protocols
- Efficient asset management and yield generation
- Built-in mechanisms for deposits, withdrawals, and yield distribution

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
mkdir erc4626-indexing && cd erc4626-indexing
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: ERC-4626 Indexing
description: Indexing ERC-4626 vault data using Blockflow CLI
startBlock: latest
userId: [Your User ID]
projectId: [Your Project ID]
network: [Target Network]
user: [Your Username]
schema:
  file: ./studio.schema.ts
execution: parallel
Resources:
  - Name: blockflow
    Abi: src/abis/blockflow.json
    Type: contract/event
    Address: "[ERC-4626 Vault Contract Address]"
    Triggers:
      - Event: Deposit(address indexed,address indexed,uint256,uint256)
        Handler: src/handlers/blockflow/Deposit.DepositHandler
      - Event: MinimumLockUpdated(uint256)
        Handler: src/handlers/blockflow/MinimumLockUpdated.MinimumLockUpdatedHandler
      - Event: PeripheryUpdated(address)
        Handler: src/handlers/blockflow/PeripheryUpdated.PeripheryUpdatedHandler
      - Event: Transfer(address indexed,address indexed,uint256)
        Handler: src/handlers/blockflow/Transfer.TransferHandler
      - Event: Withdraw(address indexed,address indexed,uint256,uint256)
        Handler: src/handlers/blockflow/Withdraw.WithdrawHandler
```

## Schema Setup

Create `studio.schema.ts` in your project root with the following entities:

```typescript
export interface User {
  id: String;
  tokenBalance: number;
  vaultBalance: number;
  entryValue: number;
  realizedEarnings: number;
}

export interface Token {
  id: String;
  name: string;
  totalSupply: number;
}

export interface Vault {
  id: String;
  name: string;
  vaultAddress: string;
  totalSupply: number;
  totalHolding: number;
  pricePerShare: number;
  totalTokenEarnings: number;
  minimumLock: number;
  peripheryAddress: string;
}

// Include other interfaces: dailyUserTrack, monthlyUserTrack, yearlyUserTrack,
// dailyVolume, monthlyVolume, yearlyVolume, dailyAPY, weeklyAPY, monthlyAPY, yearlyAPY
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

Implement the logic for each handler in the generated files under `src/handlers/blockflow/`.

Example of a handler (Deposit.ts):

```typescript
import {
  Vault, IVault, User, IUser, dailyUserTrack, IdailyUserTrack,
  // ... other imports
} from "../../types/schema"

import {
  dailyUserTrackHandler,
  monthlyUserTrackHandler,
  yearlyUserTrackHandler,
  // ... other utility functions
} from "../../utils/tracker"

export async function DepositHandler(
  // ... handler parameters
) {
  const userDB: Instance = bind(User)
  const vaultDB: Instance = bind(Vault)
  // ... bind other DBs

  const userId = `${receiver.toString()}`
  const vaultId = `${block.chain_id.toString()}-"Vault"`

  // Update user data
  let user: IUser = await userDB.findOne({ id: userId })
  user ??= await userDB.create({
    id: userId,
    tokenBalance: 0,
    vaultBalance: 0,
    entryValue: 0,
    realizedEarnings: 0,
  })
  user.vaultBalance += assets
  user.entryValue += assets
  await userDB.save(user)

  // Update vault data
  let vault: IVault = await vaultDB.findOne({ id: vaultId })
  // ... similar logic for vault

  // Update tracking data
  await dailyUserTrackHandler(
    userId,
    dailyUserTrackDB,
    block.block_timestamp,
    assets,
    assets,
  )
  // ... other tracking updates
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

### User

- Tracks individual user data including balances and earnings

### Vault

- Represents the ERC-4626 vault, storing total supplies, holdings, and price per share

### Tracking Data

- Daily, monthly, and yearly tracking for user balances and vault performance

## Best Practices

- Regularly update the ABI file (`src/abis/blockflow.json`) to ensure compatibility with the latest ERC-4626 implementation.
- Implement proper error handling in your handler functions to manage potential issues with event data.
- Regularly monitor and optimize your database indexes to ensure efficient querying of large datasets.

## Troubleshooting

- If you encounter issues with event parsing, ensure that the ABI in `src/abis/blockflow.json` is up to date.
- For performance issues, consider optimizing your database queries and indexing frequently accessed fields.
- If you're missing events, check that your `startBlock` in `studio.yaml` is set correctly.

## Contributing

[Guidelines for contributing to the project]

## License

[Specify the license under which this project is released]

## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [ERC-4626 Specification](https://eips.ethereum.org/EIPS/eip-4626)
- [Understanding ERC-4626 Tokenized Vaults](https://ethereum.org/en/developers/docs/standards/tokens/erc-4626/)
