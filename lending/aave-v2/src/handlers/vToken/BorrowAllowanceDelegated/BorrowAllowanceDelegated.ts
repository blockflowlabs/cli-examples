import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";


import {
  IUserReserve,
  UserReserve,
  ContractToPoolMapping,
  IContractToPoolMapping,
  VariableTokenDelegatedAllowance,
  IVariableTokenDelegatedAllowance,
} from "../../../types/schema";
/**
 * @dev Event::BorrowAllowanceDelegated(address fromUser, address toUser, address asset, uint256 amount)
 * @param context trigger object with contains {event: {fromUser ,toUser ,asset ,amount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BorrowAllowanceDelegatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BorrowAllowanceDelegated here

  const { event, transaction, block, log } = context;
  let { fromUser, toUser, asset, amount } = event;

  fromUser = fromUser.toString();
  toUser = toUser.toString();
  asset = asset.toString();
  amount = amount.toString();

  let poolId: string;

  const contractToPoolMappingDB = bind(ContractToPoolMapping);
  const contractToPoolMapping: IContractToPoolMapping =
    await contractToPoolMappingDB.findOne({ id: event.address });

  if (!contractToPoolMapping) poolId = "not yet defined";
  else poolId = contractToPoolMapping.pool;

  const userReserveDB = bind(UserReserve);
  const userReserveId = getUserReserveId(fromUser, asset, poolId);
  let userReserve: IUserReserve = await userReserveDB.findOne({
    id: userReserveId,
  });

  userReserve ??= await userReserveDB.create({
    id: userReserveId,
    pool: poolId,
    usageAsCollateralEnabledOnUser: false,
    scaledATokenBalance: "0",
    scaledVariableDebt: "0",
    principalStableDebt: "0",
    currentATokenBalance: "0",
    currentVariableDebt: "0",
    currentStableDebt: "0",
    stableBorrowRate: "0",
    oldStableBorrowRate: "0",
    currentTotalDebt: "0",
    variableBorrowIndex: "0",
    lastUpdateTimestamp: 0,
    liquidityRate: "0",
    stableBorrowLastUpdateTimestamp: 0,

    // incentives
    aTokenincentivesUserIndex: "0",
    vTokenincentivesUserIndex: "0",
    sTokenincentivesUserIndex: "0",
    aIncentivesLastUpdateTimestamp: 0,
    vIncentivesLastUpdateTimestamp: 0,
    sIncentivesLastUpdateTimestamp: 0,
    user: fromUser.toString(),

    reserve: asset + poolId,
  });

  let delegatedAllowanceId =
    "variable" + fromUser.toString() + toUser.toString() + asset.toString();

  let stabletokendaDB = bind(VariableTokenDelegatedAllowance);
  let delegatedAllowance: IVariableTokenDelegatedAllowance =
    await stabletokendaDB.findOne({
      id: delegatedAllowanceId,
    });

  delegatedAllowance ??= await stabletokendaDB.create({
    id: delegatedAllowanceId,
    fromUser: fromUser,
    toUser: toUser,
    userReserve: userReserve.id,
  });
  delegatedAllowance.amountAllowed = amount;
  await stabletokendaDB.save(delegatedAllowance);
};

function getUserReserveId(
  userAddress: string,
  underlyingAssetAddress: string,
  poolId: string
): string {
  return userAddress + underlyingAssetAddress + poolId;
}

