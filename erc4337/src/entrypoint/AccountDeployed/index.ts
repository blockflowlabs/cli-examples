import { BigNumber } from "bignumber.js";
import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import {
  Blockchain,
  Paymaster,
  AccountFactory,
  Account,
} from "../../types/schema";

/**
 * @dev Event::AccountDeployed(bytes32 userOpHash, address sender, address factory, address paymaster)
 * @param context trigger object with contains {event: {userOpHash ,sender ,factory ,paymaster }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AccountDeployedHandler = async (
  context: IEventContext,
  bind: IBind
) => {
  try {
    // Implement your event handler logic for UserOperationRevertReason here
    const { event, transaction, block } = context;
    let { userOpHash, sender, factory, paymaster } = event;

    sender = sender.toString();
    factory = factory.toString();
    paymaster = paymaster.toString();
    userOpHash = userOpHash.toString();

    await updateBlockchain(bind(Blockchain));
    await updatePaymaster(
      bind(Paymaster),
      block.block_timestamp,
      paymaster,
      userOpHash
    );
    await updateAccountFactory(bind(AccountFactory), factory);

    {
      const IAccount = bind(Account);
      let account = await IAccount.findOne({ id: sender.toLowerCase() });
      let firstBlood = false;
      if (!account) {
        firstBlood = true;
        account = await IAccount.create({ id: sender.toLowerCase() });

        account.factory = factory.toLowerCase();
        account.paymaster = paymaster.toLowerCase();
        account.totalOperations = "0";

        account.createdAt = block.block_timestamp;
        account.createdHash = transaction.transaction_hash;
        account.createdOpHash = userOpHash;
      }

      account.factory = factory.toLowerCase();
      account.updatedAt = block.block_timestamp;

      if (firstBlood) await IAccount.save(account);
      else await IAccount.updateOne({ id: sender.toLowerCase() }, account);
    }
  } catch (error) {
    console.error(error);
  }
};

const updateBlockchain = async (IBlockchain: Instance) => {
  try {
    let firstBlood = false;
    let blockchain = await IBlockchain.findOne({ id: "ETH" });
    if (!blockchain) {
      blockchain = await IBlockchain.create({ id: "ETH" });
      firstBlood = true;
    }

    blockchain.totalAccount = blockchain.totalAccount || 0;
    blockchain.totalAccount = new BigNumber(blockchain.totalAccount)
      .plus(1)
      .toString();

    if (firstBlood) await IBlockchain.save(blockchain);
    else await IBlockchain.updateOne({ id: blockchain.id }, blockchain);
  } catch (error) {
    console.error(error);
  }
};

const updatePaymaster = async (
  IPaymaster: Instance,
  timestamp: string,
  id: string,
  userOpHash: string
) => {
  try {
    let paymaster = await IPaymaster.findOne({ id: id.toLowerCase() });
    let firstBlood = false;
    if (!paymaster) {
      firstBlood = true;
      paymaster = await IPaymaster.create({ id: id.toLowerCase() });
      paymaster.totalOperations = "0";
      paymaster.createdAt = timestamp;
    }

    paymaster.ops.push(userOpHash);
    paymaster.updatedAt = timestamp;
    paymaster.totalOperations = new BigNumber(paymaster.totalOperations)
      .plus(1)
      .toString();

    if (firstBlood) await IPaymaster.save(paymaster);
    else await IPaymaster.updateOne({ id: id.toLowerCase() }, paymaster);
  } catch (error) {
    console.error(error);
  }
};

const updateAccountFactory = async (Ifactory: Instance, id: string) => {
  try {
    let factory = await Ifactory.findOne({ id: id.toLowerCase() });
    let firstBlood = false;
    if (!factory) {
      factory = await Ifactory.create({ id: id.toLowerCase() });
      factory.totalAccount = 0;
      firstBlood = !firstBlood;
    }

    factory.totalAccount = factory.totalAccount + 1;

    if (firstBlood) await Ifactory.save(factory);
    else await Ifactory.updateOne({ id: id.toLowerCase() }, factory);
  } catch (error) {
    console.error(error);
  }
};
