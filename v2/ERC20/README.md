# BlockFlow Studio

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://www.npmjs.com/package/@blockflow-labs/cli/v/1.0.7-beta.1?activeTab=readme)

BlockFlow is a cutting-edge data infrastructure platform that revolutionizes how you interact with on-chain data. Our platform enables seamless data transformation, streaming, and integration capabilities, supporting both real-time and historical data access.

With BlockFlow's robust command-line interface (CLI), you can unlock the platform's full potential. Focus on building innovative features for your Web3 application while we manage the complex backend infrastructure.

## Installation

BlockFlow requires [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/) v18+ with TypeScript support.

```sh
npm i -g @blockflow-labs/cli
```

Verify your installation:

```sh
blockflow --version
```

Set up your BlockFlow credentials to get started. Find your credentials [here](https://docs.blockflow.network/v/cli/getting-started/installation#accessing-access-key-and-secret-key-in-blockflow).

```sh
blockflow configure
```

## Project Initialization

Create a new project in an empty directory using the `blockflow init` command. This launches an interactive setup wizard where you can either configure your project from scratch or build upon existing templates.

```sh
blockflow init
```

## Configuration

BlockFlow Studio uses a YAML configuration file (`studio.yaml`) in your project's root directory to manage settings. Here are the key configuration components:

| Configuration | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `Version`     | Specifies the BlockFlow YAML template version (currently 2.0.0)                |
| `Type`        | Determines the deployment mode: either `instance` or `api`                     |
| `Metadata`    | Contains your instance name and description                                    |
| `Auth`        | Stores BlockFlow credentials required for deployment                           |
| `Path`        | Specifies locations of your docker-compose and studio.schema.ts files          |
| `Environment` | Defines settings for testing and deployment (network, chain, startBlock, RPCs) |
| `Secrets`     | Stores sensitive variables securely for runtime injection                      |
| `Resources`   | Specifies smart contracts for indexing or APIs built on indexed data           |

### Resources

The resources section lets you define multiple data sources from blockchain networks, smart contracts, or APIs. Each data source includes:

| Parameters | Description                                                        |
| ---------- | ------------------------------------------------------------------ |
| `name`     | Unique identifier for the data source                              |
| `type`     | Resource category specification                                    |
| `abi`      | Location of the smart contract's ABI file for interface definition |
| `address`  | Data source's blockchain address                                   |
| `triggers` | Maps smart contract events/functions to their handler functions    |

For detailed configuration information, visit our [documentation](https://docs.blockflow.network/v/cli/deep-dive/configuring-yaml).

## Blockflow Commands

Validate your configuration:

```sh
blockflow validate
```

Generate event/function listings in `studio.yaml`:

```sh
blockflow generate
```

Create handlers in your project:

```sh
blockflow codegen
```

Test locally using Docker with MongoDB and PostgreSQL:

```bash
blockflow test
```

#### Deployment

Deploy your tested project to the BlockFlow server:

```bash
blockflow deploy
```

#### Template Usage

Jump-start development using pre-built templates:

```bash
blockflow apply --template template-name
```

Available templates from the BlockFlow team:

| Template  | Description                                                    |
| --------- | -------------------------------------------------------------- |
| `ERC20`   | Standard fungible token interface for Ethereum                 |
| `ERC4337` | Account abstraction protocol for enhanced wallet functionality |
| `ERC721`  | Standard non-fungible token (NFT) interface for Ethereum       |
| `Lido`    | Liquid ETH staking protocol with maintained liquidity          |
| `ENS`     | Decentralized domain naming system for Ethereum                |

For comprehensive details about BlockFlow Studio and its capabilities, explore our [documentation](https://docs.blockflow.network/v/cli).

> Interested in contributing or exploring examples?
> We'd love your involvement! Star our [examples repository](https://github.com/BlockFloww/cli-examples).
