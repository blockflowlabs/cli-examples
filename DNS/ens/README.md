# Ethereum Name Service (ENS) Indexing

This project demonstrates how to index the Ethereum Name Service (ENS) protocol using Blockflow CLI. ENS is a decentralized protocol on the Ethereum blockchain that converts complex, alphanumeric addresses into human-readable names, simplifying cryptocurrency transactions and interactions with decentralized applications (dApps).

## Key Features

- Index ENS domain registrations and related events
- Track domain ownership, expiry dates, and other metadata
- Simplify queries for ENS-related data

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
mkdir ens-indexing && cd ens-indexing
```

Initialize the project:

```bash
blockflow init
```

Follow the prompts to configure your project.

## Configuration

Update the `studio.yaml` file in your project root with the following structure:

```yaml
name: ENS Indexing
description: Indexing the Ethereum Name Service
startBlock: 9412610
userId: [Your User ID]
projectId: [Your Project ID]
network: Ethereum
user: [Your Username]
execution: sequential
schema:
  file: ./studio.schema.ts
Resources:
  - Name: baseRegistrar
    Abi: src/abis/BaseRegistrar.json
    Type: contract/event
    Address: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"
    Triggers:
      - Event: NameRegistered(uint256 indexed,address indexed,uint256)
        Handler: src/handlers/BaseRegistrar/NameRegisteredHandler/index.NameRegisteredHandler
```

## Schema Setup

Create `studio.schema.ts` in your project root with the following entities:

```typescript
export interface Registration {
  id: String;
  domain: String;
  registrationDate: String;
  expiryDate: Number;
  cost: Number;
  registrant: String;
  labelName: String;
  events: [String];
}

// Add other interfaces as needed (Account, Domain, Resolver, etc.)
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

Implement the logic for the NameRegistered handler in `src/handlers/BaseRegistrar/NameRegisteredHandler/index.ts`:

```typescript
import { Registration } from "../../../types/schema";

export const NameRegisteredHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context;
  const { id, owner, expires } = event;

  const registrationDB: Instance = bind(Registration);

  const isoDate = new Date(Number(block.block_timestamp) * 1000).toISOString();

  let registration = await registrationDB.findOne({
    id: id.toString(),
  });

  if (!registration) {
    await registrationDB.create({
      id: id.toString(),
      domain: "",
      registrationDate: isoDate.toString(),
      expiryDate: expires.toString(),
      cost: "",
      registrant: owner,
      labelName: "",
      events: [],
    });
  } else {
    registration.registrant = owner;
    registration.events.push({
      id: id.toString(),
      blockNumber: block.block_number,
      transactionID: transaction.transaction_hash,
    });
    await registrationDB.save(registration);
  }
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

### Registration

- Represents an ENS domain registration
- Stores information about registration date, expiry, registrant, and related events

### NameRegisteredHandler

- Processes NameRegistered events from the ENS BaseRegistrar contract
- Creates or updates Registration records in the database


## Best Practices

- Implement proper error handling in your handler functions to manage potential issues with event data.
- Regularly monitor and optimize your database indexes to ensure efficient querying of large datasets.

## Troubleshooting

- If you're missing registrations, check that your `startBlock` in `studio.yaml` is set correctly (ENS was deployed at block 9380410).
- For performance issues, consider optimizing your database queries and indexing frequently accessed fields.
- If you encounter issues with event parsing, ensure that the ABI in `src/abis/BaseRegistrar.json` is up to date.


## Additional Resources

- [Blockflow Documentation](https://docs.blockflow.network/)
- [ENS Documentation](https://docs.ens.domains/)
- [ENS Subgraph](https://thegraph.com/explorer/subgraph?id=2S4xzk4YQKPpBGYzfK8JyqGqjTkZFTqXhUVnQUmpEvMz&view=Overview)
