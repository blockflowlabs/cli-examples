import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Operator } from "../../types/generated";

/**
 * @dev Event::OperatorDetailsModified(address operator, tuple newOperatorDetails)
 * @param context trigger object with contains {event: {operator ,newOperatorDetails }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorDetailsModifiedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for OperatorDetailsModified here

  const { event, transaction, block, log } = context;
  const { operator, newOperatorDetails } = event;

  const { earningsReceiver, delegationApprover, stakerOptOutWindowBlocks } = newOperatorDetails;

  const client = Instance.PostgresClient(bind);
  const operatorDb = client.db(Operator);

  const operatorData = await operatorDb.load({ address: operator.toLowerCase() });

  if (operatorData) {
    operatorData.details = {
      earningsReceiver,
      delegationApprover,
      stakerOptOutWindowBlocks: Number(stakerOptOutWindowBlocks),
    };
    operatorData.updatedAt = block.block_timestamp;
    operatorData.updatedAtBlock = block.block_number;

    await operatorDb.save(operatorData);
  }
};
