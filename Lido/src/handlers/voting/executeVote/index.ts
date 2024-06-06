import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  ILidoShares,
  ILidoTotals,
  IVoting,
  LidoShares,
  LidoTotals,
  Voting,
} from "../../../types/schema";

import { _loadLidoSharesEntity, _loadLidoTotalsEntity } from "../../../helpers";
import BigNumber from "bignumber.js";

/**
 * @dev Event::ExecuteVote(uint256 voteId)
 * @param context trigger object with contains {event: {voteId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ExecuteVoteHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for ExecuteVote here

  const { event, transaction, block, log } = context;
  const { voteId } = event;

  const votingDB: Instance = bind(Voting);

  let entity: IVoting = await votingDB.findOne({ id: voteId.toString() });

  entity.executed = true;

  if (
    transaction.transaction_hash ==
    "0x55eb29bda8d96a9a92295c358edbcef087d09f24bd684e6b4e88b166c99ea6a7"
  ) {
    const accToBurn = "0x3e40d73eb977dc6a537af587d48316fee66e9c8c";
    const sharesToSubtract = "32145684728326685744";

    const lidoSharesDB: Instance = bind(LidoShares);

    let shares: ILidoShares = await _loadLidoSharesEntity(
      lidoSharesDB,
      accToBurn
    );

    shares.shares = new BigNumber(shares.shares)
      .minus(sharesToSubtract)
      .toString();

    if (Number(shares.shares) < 0) {
      //throw new Error(""Negative shares.hares!"");
      return;
    }

    await lidoSharesDB.save(shares);

    const lidoTotalsDB: Instance = bind(LidoTotals);

    const totals: ILidoTotals = await _loadLidoTotalsEntity(lidoTotalsDB);

    totals.total_shares = new BigNumber(totals.total_shares)
      .minus(sharesToSubtract)
      .toString();

    if (Number(totals.total_shares) < 0) {
      //throw new Error(""Negative shares.hares!"");
      return;
    }

    await lidoTotalsDB.save(totals);
  }

  await votingDB.save(entity);
};
