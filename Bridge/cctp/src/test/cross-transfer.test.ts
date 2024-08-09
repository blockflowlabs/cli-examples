import { describe, test, it, afterAll, beforeAll, expect } from "@jest/globals";
import {
  ContractEventContext,
  LiveContractEventContext,
} from "@blockflow-labs/cli-test";

import tokenmessenger from "../abis/tokenmessenger.json";
import { DepositForBurnHandler } from "../handlers/DepositForBurn";
import { MessageReceivedHandler } from "../handlers/MessageReceived";
import { burnTransactionsTable, mintTransactionsTable } from "../types/schema";

describe("it should index cross chain transfers", () => {
  let eventObj: ContractEventContext;
  let liveEventObj: LiveContractEventContext;

  let bind: any;
  let secrets: {};

  beforeAll(async () => {
    eventObj = new ContractEventContext({
      projectId: "781ad537-7532-430b-b3e1-f62f391a7fc2",
      secrets,
    });

    liveEventObj = new LiveContractEventContext({
      projectId: "781ad537-7532-430b-b3e1-f62f391a7fc2",
      secrets,
    });

    // open the db connection now
    await eventObj.open();
    await liveEventObj.open();

    bind = (klass: any) => eventObj.bind(klass);
  });

  afterAll(async () => {
    // close the db connection now
    await eventObj.close();
  });

  it("Should index cross chain transfer between Etheruem to Arbitrum", async () => {
    // etheruem domain id - 0
    // arbitrum domain id - 3
    const srcChainId = "1";
    const srcEvent = {
      nonce: "0",
      burnToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      amount: "100000",
      depositor: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      mintRecipient: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      destinationDomain: "3",
      destinationTokenMessenger: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      destinationCaller: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    };

    let { context } = await eventObj.getTestingParams(srcEvent, srcChainId);
    await DepositForBurnHandler(context, bind, secrets);

    const burnDB = bind(burnTransactionsTable);
    const srcTx = await burnDB.findOne({ id: "0_1_42161" });

    const dstEvent = {
      caller: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      sourceDomain: "0",
      nonce: "0",
      sender: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      messageBody: "0x",
    };
    const destChainId = "42161";

    const dstParams = await eventObj.getTestingParams(dstEvent, destChainId);
    await MessageReceivedHandler(dstParams.context, bind, secrets);

    const mintDB = dstParams.bind(mintTransactionsTable);
    const dstTx = await mintDB.findOne({ id: "0_1_42161" });

    expect(dstTx.messageSender).toEqual(srcTx.messageSender);
    expect(dstTx.messageSender).toEqual(srcTx.messageSender);
  });

  it("Should work with run ", async () => {
    // etheruem domain id - 0
    // arbitrum domain id - 3
    const srcChainId = "1";
    const srcEvent = {
      nonce: "0",
      burnToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      amount: "100000",
      depositor: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      mintRecipient: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      destinationDomain: "3",
      destinationTokenMessenger: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      destinationCaller: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    };

    await eventObj.run(srcEvent, srcChainId, DepositForBurnHandler);
  });

  it("Should work with live ", async () => {
    const params = {
      event:
        "DepositForBurn(uint64 indexed,address indexed,uint256,address indexed,bytes32,uint32,bytes32,bytes32)",
      abi: tokenmessenger,
      network: "Ethereum",
      startBlock: 20483044,
      range: 10,
      rpc: "https://eth.llamarpc.com",
      address: "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
    };

    await liveEventObj.run(params, DepositForBurnHandler);
  });
});
