import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { CurrentFee, ICurrentFee } from "../../../types/schema";
import { _loadCurrentFeeEntity } from "../../../helpers";

/**
 * @dev Event::FeeDistributionSet(uint16 treasuryFeeBasisPoints, uint16 insuranceFeeBasisPoints, uint16 operatorsFeeBasisPoints)
 * @param context trigger object with contains {event: {treasuryFeeBasisPoints ,insuranceFeeBasisPoints ,operatorsFeeBasisPoints }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FeeDistributionSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for FeeDistributionSet here

  const { event, transaction, block, log } = context;

  const {
    treasuryFeeBasisPoints,
    insuranceFeeBasisPoints,
    operatorsFeeBasisPoints,
  } = event;

  const currentFeeDB: Instance = bind(CurrentFee);

  let currentFee: ICurrentFee = await _loadCurrentFeeEntity(
    currentFeeDB,
    context
  );

  currentFee.treasury_fee_basis_points = treasuryFeeBasisPoints.toString();
  currentFee.insurance_fee_basis_points = insuranceFeeBasisPoints.toString();
  currentFee.operators_fee_basis_points = operatorsFeeBasisPoints.toString();

  await currentFeeDB.save(currentFee);
};
