import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  Operator,
  AVS,
  AVSRegistrations,
  AvsOperator,
} from "../../types/schema";

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

  const avsOperatorId = `${operator.toLowerCase()}_${avs.toLowerCase()}`;

  const operatorDb: Instance = bind(Operator);
  const avsDb: Instance = bind(AVS);
  const avsOperatorDb: Instance = bind(AvsOperator);

  const operatorData = await operatorDb.findOne({ id: operator.toLowerCase() });
  const avsData = await avsDb.findOne({ id: avs.toLowerCase() });
  const avsOperatorData = await avsOperatorDb.findOne({ id: avsOperatorId });

  if (avsOperatorData) {
    avsOperatorData.isActive = status === 1;
    await avsOperatorDb.save(avsOperatorData);
  } else {
    await avsOperatorDb.create({
      id: avsOperatorId,
      avsAddress: avs.toLowerCase(),
      operatorAddress: operator.toLowerCase(),
      isActive: status === 1,
      createdAt: block.block_timestamp,
      createdAtBlock: block.block_number,
    });
  }

  if (avsData) {
    const activeOperatorIndex = avsData.activeOperators.findIndex(
      (address: string) => address === operator.toLowerCase()
    );
    const inactiveOperatorIndex = avsData.inactiveOperators.findIndex(
      (address: string) => address === operator.toLowerCase()
    );

    if (status === 1) {
      if (activeOperatorIndex === -1) {
        avsData.activeOperators.push(operator.toLowerCase());
      }
      if (inactiveOperatorIndex !== -1) {
        avsData.inactiveOperators.splice(inactiveOperatorIndex, 1);
      }
    } else if (status === 0) {
      if (inactiveOperatorIndex === -1) {
        avsData.inactiveOperators.push(operator.toLowerCase());
      }
      if (activeOperatorIndex !== -1) {
        avsData.activeOperators.splice(activeOperatorIndex, 1);
      }
    }
    const totalOperators =
      avsData.activeOperators.length + avsData.inactiveOperators.length;
    avsData.totalOperators = totalOperators;

    await avsDb.save(avsData);
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
