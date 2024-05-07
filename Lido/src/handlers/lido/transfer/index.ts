import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  ILidoNodeOperatorFees,
  ILidoNodeOperatorsShares,
  ILidoSubmission,
  ILidoTotalReward,
  ILidoTransfer,
  LidoNodeOperatorFees,
  LidoNodeOperatorsShares,
  LidoSubmission,
  LidoTotalReward,
  LidoTotals,
  LidoTransfer,
} from "../../../types/schema";
import {
  _loadLidoNodeOperatorFeesEntity,
  _loadLidoNodeOperatorsSharesEntity,
  _loadLidoTotalRewardEntity,
  _loadLidoTotalsEntity,
  _loadLidoTransferEntity,
  _updateHolders,
  _updateTransferBalances,
  _updateTransferShares,
} from "../../../helpers";
import {
  ADDRESS,
  PROTOCOL_UPG_BLOCKS,
  ZERO,
  ZERO_ADDRESS,
} from "../../../constants";
import { TRANSFER_SHARES_TOPIC0 } from "../../../constants";
import { decodeTransferShares } from "../../../utils";
import BigNumber from "bignumber.js";

/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param context trigger object with contains {event: {from ,to ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Transfer here

  const { event, transaction, block, log } = context;
  const { from, to, value } = event;

  const lidoTransferDB: Instance = bind(LidoTransfer);
  const lidoTotalsDB: Instance = bind(LidoTotals);

  let transfer: ILidoTransfer = await _loadLidoTransferEntity(
    lidoTransferDB,
    context,
  );

  transfer.from = from.toString().toLowerCase();
  transfer.to = to.toString().toLowerCase();
  transfer.value = value.toString();

  const totals = await _loadLidoTotalsEntity(lidoTotalsDB, context);

  if (totals.total_pooled_ether > ZERO) {
    transfer.total_pooled_ether = totals.total_pooled_ether;

    transfer.total_shares = totals.total_shares;

    const isLidoTransferShares = transaction
      ? transaction.logs.find(
          (log) => log.topics[0].toLowerCase() === TRANSFER_SHARES_TOPIC0,
        )
      : null;

    let shares: string;

    if (isLidoTransferShares) {
      const decodeTx: any = decodeTransferShares(isLidoTransferShares);
      shares = decodeTx[2].toString();

      transfer.shares = shares;

      if (transfer.value == "0" && transfer.shares == "0") {
        return;
      }
    } else {
      shares = new BigNumber(transfer.value)
        .times(totals.total_shares)
        .div(totals.total_pooled_ether)
        .toString();
    }

    if (transfer.from == ZERO_ADDRESS) {
      const lidoTotalRewardDB: Instance = bind(LidoTotalReward);

      let totalReward: ILidoTotalReward = await _loadLidoTotalRewardEntity(
        lidoTotalRewardDB,
        context,
      );

      let isLidoV2 = block.block_number > PROTOCOL_UPG_BLOCKS["V2"];

      if (totalReward) {
        if (isLidoV2) {
        } else {
          if (
            transfer.to == ADDRESS["INSURANCE_FUND"] &&
            !(totalReward.insurance_fee_basis_points == "0") &&
            totalReward.insurance_fee == "0"
          ) {
            totalReward.insurance_fee = new BigNumber(totalReward.insurance_fee)
              .plus(transfer.value)
              .toString();

            transfer.shares = totalReward.shares_to_insurance_fund;
          } else if (transfer.to == ADDRESS["TREASURY"]) {
            let shares: string;
            if (totalReward.treasury_fee_basis_points == "0") {
              totalReward.dust = new BigNumber(totalReward.dust)
                .plus(transfer.value)
                .toString();

              shares = totalReward.dust_shares_to_treasury;
            } else {
              totalReward.treasury_fee = new BigNumber(totalReward.treasury_fee)
                .plus(transfer.value)
                .toString();
              shares = totalReward.shares_to_treasury;
            }
            transfer.shares = shares;
          } else {
            const lidoNodeOperatorFeesDB: Instance = bind(LidoNodeOperatorFees);
            let nodeOperatorFees: ILidoNodeOperatorFees =
              await _loadLidoNodeOperatorFeesEntity(
                lidoNodeOperatorFeesDB,
                context,
              );

            lidoNodeOperatorFeesDB.save(nodeOperatorFees);

            const lidoNodeOperatorsSharesDB: Instance = bind(
              LidoNodeOperatorsShares,
            );
            let nodeOperatorsShares: ILidoNodeOperatorsShares =
              await _loadLidoNodeOperatorsSharesEntity(
                lidoNodeOperatorsSharesDB,
                context,
              );

            transfer.shares = nodeOperatorsShares.shares;
            totalReward.operators_fee = new BigNumber(totalReward.operators_fee)
              .plus(transfer.value)
              .toString();
          }
          if (transfer.value != "0") {
            totalReward.total_rewards = new BigNumber(totalReward.total_rewards)
              .minus(transfer.value)
              .toString();

            totalReward.total_fee = new BigNumber(totalReward.total_fee)
              .plus(transfer.value)
              .toString();

            lidoTotalRewardDB.save(totalReward);
          }
        }
      } else {
        if (!isLidoTransferShares) {
          const lidoSubmissionDB: Instance = bind(LidoSubmission);
          let submissionIndex =
            `${transaction.transaction_hash}:${new BigNumber(log.log_index).minus("1").toString()}`.toLowerCase();
          let submission: ILidoSubmission = await lidoSubmissionDB.findOne({
            id: submissionIndex,
          });

          transfer.shares = submission.shares;
        }
      }
    }
  }

  transfer = await _updateTransferShares(transfer, bind);
  transfer = await _updateTransferBalances(transfer);
  await _updateHolders(transfer, context, bind);

  await lidoTransferDB.save(transfer);
};
