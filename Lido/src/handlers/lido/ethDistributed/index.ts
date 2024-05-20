import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  decodeSharesBurntEvent,
  decodeTokenRebasedEvent,
} from "../../../utils";
import {
  CALCULATION_UNIT,
  E27_PRECISION_BASE,
  ONE_HUNDRED_PERCENT,
  SECONDS_PER_YEAR,
  SHARES_BURNT_EVENT_TOPIC0,
  TOKEN_REBASE_EVENT_TOPIC0,
  ZERO,
} from "../../../constants";
import {
  ILidoTotalReward,
  ILidoTotals,
  LidoTotalReward,
  LidoTotals,
} from "../../../types/schema";
import {
  _loadLidoTotalRewardEntity,
  _loadLidoTotalsEntity,
} from "../../../helpers";

import { SharesBurntHandler } from "../sharesBurnt";
import BigNumber from "bignumber.js";

/**
 * @dev Event::ETHDistributed(uint256 reportTimestamp, uint256 preCLBalance, uint256 postCLBalance, uint256 withdrawalsWithdrawn, uint256 executionLayerRewardsWithdrawn, uint256 postBufferedEther)
 * @param context trigger object with contains {event: {reportTimestamp ,preCLBalance ,postCLBalance ,withdrawalsWithdrawn ,executionLayerRewardsWithdrawn ,postBufferedEther }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ETHDistributedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ETHDistributed here

  const { event, transaction, block, log } = context;

  const {
    reportTimestamp,
    preCLBalance,
    postCLBalance,
    withdrawalsWithdrawn,
    executionLayerRewardsWithdrawn,
    postBufferedEther,
  } = event;

  const isTokenRebasedEvent = transaction
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === TOKEN_REBASE_EVENT_TOPIC0,
      )
    : null;

  const decodeTokenRebasedEventTx: any =
    decodeTokenRebasedEvent(isTokenRebasedEvent);

  if (!isTokenRebasedEvent) {
    return;
  }

  const lidoTotalsDB: Instance = bind(LidoTotals);

  const totals: ILidoTotals = await _loadLidoTotalsEntity(
    lidoTotalsDB,
    context,
  );

  await lidoTotalsDB.save(totals);

  const isSharesBurntEvent = transaction
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === SHARES_BURNT_EVENT_TOPIC0,
      )
    : null;

  const decodeSharesBurntEventTx: any =
    decodeSharesBurntEvent(isSharesBurntEvent);

  if (isSharesBurntEvent) {
    console.log(decodeSharesBurntEventTx);
    console.log(context);
    //fix this here
    await SharesBurntHandler(context, bind, secrets);
  }

  totals.total_shares = decodeTokenRebasedEventTx[4];

  await lidoTotalsDB.save(totals);

  const postCLTotalBalance = new BigNumber(postCLBalance).plus(
    withdrawalsWithdrawn,
  );

  if (postCLTotalBalance < preCLBalance) {
    return;
  }

  const totalRewards = new BigNumber(postCLTotalBalance)
    .minus(preCLBalance)
    .plus(executionLayerRewardsWithdrawn);

  const lidoTotalRewardDB: Instance = bind(LidoTotalReward);

  let totalRewardEntity: ILidoTotalReward = await _loadLidoTotalRewardEntity(
    lidoTotalRewardDB,
    context,
  );

  totalRewardEntity.total_rewards = totalRewards.toString();

  totalRewardEntity.total_rewards_with_fees = totalRewardEntity.total_rewards;

  totalRewardEntity.mev_fee = executionLayerRewardsWithdrawn.toString();

  //process token rebase

  totalRewardEntity.total_pooled_ether_before = decodeTokenRebasedEventTx[3]; //pre total ether;
  totalRewardEntity.total_shares_before = decodeTokenRebasedEventTx[2]; //pre total shares;
  totalRewardEntity.total_pooled_ether_after = decodeTokenRebasedEventTx[5]; //post total ether;
  totalRewardEntity.total_shares_after = decodeTokenRebasedEventTx[4]; //post total shares;
  totalRewardEntity.shares_to_mint = decodeTokenRebasedEventTx[6]; // shares minted as fees;
  totalRewardEntity.time_elapsed = decodeTokenRebasedEventTx[1]; // time elapsed;

  //event pair code fix

  let sharesToTreasury = ZERO;
  let sharesToOperators = ZERO;
  let treasuryFee = ZERO;
  let operatorsFee = ZERO;

  //insurance fund anymore since v2

  totalRewardEntity.shares_to_treasury = sharesToTreasury;
  totalRewardEntity.treasury_fee = treasuryFee;
  totalRewardEntity.shares_to_operators = sharesToOperators;
  totalRewardEntity.operators_fee = operatorsFee;
  totalRewardEntity.total_fee = new BigNumber(treasuryFee)
    .plus(operatorsFee)
    .toString();

  totalRewardEntity.total_rewards = new BigNumber(
    totalRewardEntity.total_rewards_with_fees,
  )
    .minus(totalRewardEntity.total_fee)
    .toString();

  totalRewardEntity.treasury_fee_basis_points = new BigNumber(treasuryFee)
    .times(CALCULATION_UNIT)
    .div(totalRewardEntity.total_fee)
    .toString();

  totalRewardEntity.operators_fee_basis_points = new BigNumber(operatorsFee)
    .times(CALCULATION_UNIT)
    .div(totalRewardEntity.total_fee)
    .toString();

  totalRewardEntity.fee_basis = new BigNumber(totalRewardEntity.total_fee)
    .times(CALCULATION_UNIT)
    .div(totalRewardEntity.total_rewards_with_fees)
    .toString();

  //calculate APR
  const preShareRate = new BigNumber(
    totalRewardEntity.total_pooled_ether_before,
  )
    .times(E27_PRECISION_BASE)
    .div(totalRewardEntity.total_shares_before);

  const postShareRate = new BigNumber(
    totalRewardEntity.total_pooled_ether_after,
  )
    .times(E27_PRECISION_BASE)
    .div(totalRewardEntity.total_shares_after);

  totalRewardEntity.apr = new BigNumber(SECONDS_PER_YEAR)
    .times(postShareRate.minus(preShareRate))
    .times(ONE_HUNDRED_PERCENT)
    .div(preShareRate)
    .div(totalRewardEntity.time_elapsed)
    .toString();

  totalRewardEntity.apr_raw = totalRewardEntity.apr;
  totalRewardEntity.apr_before_fees = totalRewardEntity.apr;

  await lidoTotalRewardDB.save(totalRewardEntity);
};
