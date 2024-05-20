import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  ILidoShares,
  ILidoSubmission,
  ILidoTotals,
  LidoShares,
  LidoSubmission,
  LidoTotals,
} from "../../../types/schema";

import {
  _loadLidoSharesEntity,
  _loadLidoSubmissionEntity,
  _loadLidoTotalsEntity,
} from "../../../helpers";
import { TRANSFER_SHARES_TOPIC0 } from "../../../constants";
import { decodeTransferShares } from "../../../utils";
import BigNumber from "bignumber.js";

/**
 * @dev Event::Submitted(address sender, uint256 amount, address referral)
 * @param context trigger object with contains {event: {sender ,amount ,referral }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SubmittedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Submitted here

  const { event, transaction, block, log } = context;
  const { sender, amount, referral } = event;

  const lidoSubmissionDB: Instance = bind(LidoSubmission);

  const submission: ILidoSubmission = await _loadLidoSubmissionEntity(
    lidoSubmissionDB,
    context,
  );

  const lidoTotalsDB = bind(LidoTotals);

  const totals: ILidoTotals = await _loadLidoTotalsEntity(
    lidoTotalsDB,
    context,
  );

  let shares: string;

  const isLidoTransferShares = transaction
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === TRANSFER_SHARES_TOPIC0,
      )
    : null;

  if (isLidoTransferShares) {
    const decodeTx: any = decodeTransferShares(isLidoTransferShares);
    shares = decodeTx[2].toString();
  } else {
    shares =
      totals.total_pooled_ether === "0"
        ? amount.toString()
        : new BigNumber(amount.toString())
            .times(totals.total_shares)
            .div(totals.total_pooled_ether)
            .toString();
    if (shares === "0") {
      shares = amount.toString();
    }
  }

  submission.shares = shares;

  let lidoSharesDB: Instance = bind(LidoShares);

  let userShares: ILidoShares = await _loadLidoSharesEntity(
    lidoSharesDB,
    sender,
  );

  submission.shares_before = userShares.shares;
  submission.shares_after = new BigNumber(submission.shares_before)
    .plus(shares)
    .toString();

  submission.total_pooled_ether_before = totals.total_pooled_ether;
  submission.total_shares_before = totals.total_shares;

  totals.total_pooled_ether = new BigNumber(totals.total_pooled_ether || "0")
    .plus(amount.toString())
    .toString();

  totals.total_shares = new BigNumber(totals.total_shares || "0")
    .plus(shares)
    .toString();

  await lidoTotalsDB.save(totals);

  submission.total_pooled_ether_after = totals.total_pooled_ether;
  submission.total_shares_after = totals.total_shares;

  submission.balance_after = new BigNumber(submission.shares_after)
    .times(totals.total_pooled_ether)
    .div(totals.total_shares)
    .toString();

  await lidoSubmissionDB.save(submission);
};
