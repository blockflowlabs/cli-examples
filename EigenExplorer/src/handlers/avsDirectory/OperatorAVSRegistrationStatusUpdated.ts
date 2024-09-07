import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Operator, AVS, AVSRegistrations } from "../../types/schema";

/**
 * @dev Event::OperatorAVSRegistrationStatusUpdated(address operator, address avs, uint8 status)
 * @param context trigger object with contains {event: {operator ,avs ,status }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorAVSRegistrationStatusUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for OperatorAVSRegistrationStatusUpdated here

  const { event, transaction, block, log } = context;
  const { operator, avs, status } = event;

  const operatorDb: Instance = bind(Operator);
  const avsDb: Instance = bind(AVS);

  const operatorData = await operatorDb.findOne({ id: operator.toLowerCase() });
  const avsData = await avsDb.findOne({ id: avs.toLowerCase() });

  if (avsData) {
    const operatorIndex = avsData.operators.findIndex(
      (address: string) => address === operator.toLowerCase()
    );
    if (status === 1 && operatorIndex === -1) {
      avsData.operators.push(operator.toLowerCase());
    }
  }

  if (operatorData) {
    const avsIndex = operatorData.avsRegistrations.findIndex(
      ({ address, isActive }: AVSRegistrations) => address === avs.toLowerCase()
    );
    if (status === 1) {
      if (avsIndex === -1) {
        operatorData.avsRegistrations.push({
          address: avs.toLowerCase(),
          isActive: true,
        });
      } else {
        operatorData.avsRegistrations[avsIndex].isActive = true;
      }
    } else if (status === 0) {
      if (avsIndex === -1) {
        operatorData.avsRegistrations.push({
          address: avs.toLowerCase(),
          isActive: false,
        });
      } else {
        operatorData.avsRegistrations[avsIndex].isActive = false;
      }
    }

    await operatorDb.save(operatorData);
  } else {
    await operatorDb.create({
      id: operator.toLowerCase(),
      address: operator.toLowerCase(),
      avsRegistrations: [
        {
          address: avs.toLowerCase(),
          isActive: status === 1,
        },
      ],
      shares: [],
      metadataURI: "",
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
  }
};
