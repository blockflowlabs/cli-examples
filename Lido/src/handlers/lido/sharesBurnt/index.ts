import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  ILidoTotals,
  ILidoTransfer,
  ISharesBurn,
  LidoTotals,
  LidoTransfer,
  SharesBurn,
} from "../../../types/schema";
import {
  _loadLidoTotalsEntity,
  _loadLidoTransferEntity,
  _loadSharesBurnEntity,
  _updateTransferShares,
  _updateHolders,
  _updateTransferBalances,
} from "../../../helpers";
import BigNumber from "bignumber.js";
import { ZERO, ZERO_ADDRESS } from "../../../constants";

/**
 * @dev Event::SharesBurnt(address account, uint256 preRebaseTokenAmount, uint256 postRebaseTokenAmount, uint256 sharesAmount)
 * @param context trigger object with contains {event: {account ,preRebaseTokenAmount ,postRebaseTokenAmount ,sharesAmount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SharesBurntHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for SharesBurnt here

  const { event, transaction, block, log } = context;
  const { account, preRebaseTokenAmount, postRebaseTokenAmount, sharesAmount } =
    event;

  const sharesBurnDB: Instance = bind(SharesBurn);

  let sharesBurn: ISharesBurn = await _loadSharesBurnEntity(
    sharesBurnDB,
    context,
  );

  await sharesBurnDB.save(sharesBurn);

  const lidoTotalsDB: Instance = bind(LidoTotals);
  let totals: ILidoTotals = await _loadLidoTotalsEntity(lidoTotalsDB, context);

  totals.total_shares = new BigNumber(totals.total_shares || "0")
    .minus(sharesAmount.toString())
    .toString();

  await lidoTotalsDB.save(totals);

  const lidoTransferDB: Instance = bind(LidoTransfer);
  let transfer: ILidoTransfer = await _loadLidoTransferEntity(
    lidoTransferDB,
    context,
  );

  transfer.from = account.toString().toLowerCase();

  transfer.to = ZERO_ADDRESS;

  transfer.value = postRebaseTokenAmount.toString();
  transfer.shares = sharesAmount.toString();

  transfer.total_pooled_ether = totals.total_pooled_ether;
  transfer.total_shares = totals.total_shares;

  transfer.shares_before_decrease = ZERO;
  transfer.shares_after_decrease = ZERO;
  transfer.balance_after_decrease = ZERO;

  transfer.shares_before_increase = ZERO;
  transfer.shares_after_increase = ZERO;
  transfer.balance_after_increase = ZERO;

  transfer = await _updateTransferShares(transfer, bind);
  transfer = await _updateTransferBalances(transfer);
  await _updateHolders(transfer, context, bind);

  await lidoTransferDB.save(transfer);
};
