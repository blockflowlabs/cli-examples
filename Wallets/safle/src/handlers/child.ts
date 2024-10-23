import { Instance } from "@blockflow-labs/sdk";
import { IFromContext, ISecrets } from "@blockflow-labs/utils";

import {
  userStats,
  Transaction,
  UserTransaction,
  Registration,
  IRegistration,
  IuserStats,
  IUserTransaction,
} from "../types/generated";

/**
 * @param context trigger object with contains {transaction, block}
 */
export const handler = async (
  context: IFromContext,
  bind: any,
  secrets: ISecrets
) => {
  // Implement your 'from' handler logic for undefined here
  const { transaction, block } = context;
  const client = Instance.PostgresClient(bind);

  const statsdb = client.db(userStats);
  const regidb = client.db(Registration);
  const txdb = client.db(Transaction);
  const userTxdb = client.db(UserTransaction);

  const statsDoc: IuserStats = await statsdb.load({
    address: transaction.transaction_from_address.toLowerCase(),
  });

  const regis: IRegistration = await regidb.load({
    address: transaction.transaction_from_address.toLowerCase(),
  });

  if (!regis) {
    console.error("Safle id not found for registered user");
  }

  if (!statsDoc) {
    await statsdb.save({
      address: transaction.transaction_from_address.toLowerCase(),
      safleId: regis.safleId,
      transactionsCount: 1,
    });
  } else {
    statsDoc.transactionsCount++;
    await statsdb.save(statsDoc);
  }

  // save the whole transaction into the db
  await txdb.save({
    ...transaction,
    transaction_hash: transaction.transaction_hash.toLowerCase(),
    transaction_from_address:
      transaction.transaction_from_address.toLowerCase(),
  });

  const uxTx: IUserTransaction = {
    address: transaction.transaction_from_address.toLowerCase(),
    safleId: regis.safleId,
    transactionHash: transaction.transaction_hash.toLowerCase(),
  };

  await userTxdb.save(uxTx);
};
