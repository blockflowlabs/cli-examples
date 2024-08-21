# Treasure Project

## Overview

This project is a boilerplate for the Treasure project, designed to track MAGIC token transfers on the Arbitrum network using Blockflow CLI. It sets up an indexer to capture and store Transfer events from the MAGIC token contract.

## Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn
- Blockflow CLI
- Access to an Arbitrum node or RPC endpoint

## Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd treasure-project
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Install Blockflow CLI globally (if not already installed):
   ```
   npm install -g @blockflow-labs/cli
   ```

## Project Structure

- `studio.schema.ts`: Defines the schema for the Transfer entity.
- `studio.yaml`: Configuration file for the Blockflow project.
- `src/abis/magic.json`: ABI for the MAGIC token contract.
- `src/handlers/magicToken/Transfer.ts`: Handler for Transfer events.

## Configuration

The project is configured in `studio.yaml`:

```yaml
name: Treasure
description: It is a boilerplate code for treasure project.
startBlock: 245201839
userId: xxxx-xxxx-xxxx
projectId: xxxx-xxxx-xxxx
network: Arbitrum
user: Jane-doe
schema:
  file: ./studio.schema.ts
execution: parallel
Resources:
  - Name: magicToken
    Abi: src/abis/magic.json
    Type: contract/event
    Address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342"
    Triggers:
      - Event: Transfer(address indexed,address indexed,uint256)
        Handler: src/handlers/magicToken/Transfer.TransferHandler
```

Make sure to replace `xxxx-xxxx-xxxx` with your actual user and project IDs.

## Schema

The Transfer schema is defined in `studio.schema.ts`:

```typescript
export class Transfer {
  static entity = "Transfer";
  static schema = {
    id: { type: "String", index: true },
    from: "string",
    to: "string",
    amount: "string",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}
```

## Handler

The Transfer event handler is located in `src/handlers/magicToken/Transfer.ts`:

```typescript
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  const { event, transaction, block, log } = context;
  const { from, to, value } = event;
  let transferDB: Instance = bind(Transfer);
  let transferId = `${transaction.transaction_hash}-${log.log_index}`;
  let transfer: ITransfer = await transferDB.findOne({
    id: transferId,
  });
  if (!transfer) {
    transfer = await transferDB.create({
      id: transferId,
      from: from.toString(),
      to: to.toString(),
      amount: value?.toString(),
    });
  }
};
```

## Usage

1. Generate handler files:
   ```
   blockflow codegen
   ```
2. Test the indexer:
   ```
   blockflow instance-test
   ```
3. Deploy the indexer:
   ```
   blockflow instance-deploy
   ```

## Customization

To extend this boilerplate:

1. Add new event handlers in the `src/handlers` directory.
2. Update `studio.yaml` to include new contracts or events.
3. Modify the schema in `studio.schema.ts` if you need to store additional data.

## Support

For issues or questions, please [open an issue](https://github.com/your-repo/issues) on the GitHub repository.
