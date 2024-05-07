import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { CurrentFee, ICurrentFee } from "../../../types/schema";
import { _loadCurrentFeeEntity } from "../../../helpers";

/**
 * @dev Event::FeeSet(uint16 feeBasisPoints)
 * @param context trigger object with contains {event: {feeBasisPoints }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FeeSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for FeeSet here

  const { event, transaction, block, log } = context;
  const { feeBasisPoints } = event;

  const currentFeeDB: Instance = bind(CurrentFee);

  let currentFee: ICurrentFee = await _loadCurrentFeeEntity(
    currentFeeDB,
    context,
  );

  currentFee.fee_basis_points = feeBasisPoints.toString();

  await currentFeeDB.save(currentFee);
};
