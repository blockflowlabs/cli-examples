import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { Operator, AVS, AVSRegistrations, AvsOperator, Stats, OperatorHistory } from "../../types/schema";
import { updateStats } from "../../utils/helpers";

/**
 * @dev Event::OperatorAVSRegistrationStatusUpdated(address operator, address avs, uint8 status)
 * @param context trigger object with contains {event: {operator ,avs ,status }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorAVSRegistrationStatusUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for OperatorAVSRegistrationStatusUpdated here

  const { event, transaction, block, log } = context;
  const { operator, avs, status } = event;

  const avsOperatorId = `${operator.toLowerCase()}_${avs.toLowerCase()}`;

  const operatorDb: Instance = bind(Operator);
  const avsDb: Instance = bind(AVS);
  const avsOperatorDb: Instance = bind(AvsOperator);
  const statsDb: Instance = bind(Stats);

  const operatorData = await operatorDb.findOne({ id: operator.toLowerCase() });
  const avsData = await avsDb.findOne({ id: avs.toLowerCase() });
  const avsOperatorData = await avsOperatorDb.findOne({ id: avsOperatorId });
  const operatorHistoryDb: Instance = bind(OperatorHistory);

  const operatorHistoryId = `${operator}_${transaction.transaction_hash}`.toLowerCase();

  await operatorHistoryDb.create({
    id: operatorHistoryId,
    operatorAddress: operator.toLowerCase(),
    avsAddress: avs.toLowerCase(),
    event: status === 1 ? "joinedAVS" : "leftAVS",
    transactionHash: transaction.transaction_hash,
    createdAt: block.block_timestamp,
    createdAtBlock: block.block_number,
  });

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
      (address: string) => address === operator.toLowerCase(),
    );
    const inactiveOperatorIndex = avsData.inactiveOperators.findIndex(
      (address: string) => address === operator.toLowerCase(),
    );

    const isAvsWasActive = avsData.activeOperators.length > 0;

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
    const totalOperators = avsData.activeOperators.length + avsData.inactiveOperators.length;
    avsData.totalOperators = totalOperators;

    const isAvsActive = avsData.activeOperators.length > 0;

    await avsDb.save(avsData);

    if (isAvsWasActive && !isAvsActive) {
      await updateStats(statsDb, "totalActiveAvs", 1, "subtract");
    } else if (!isAvsWasActive && isAvsActive) {
      await updateStats(statsDb, "totalActiveAvs", 1, "add");
    }
  }

  if (operatorData) {
    const avsIndex = operatorData.avsRegistrations.findIndex(
      ({ address, isActive }: AVSRegistrations) => address === avs.toLowerCase(),
    );

    const isOperatorWasActive = operatorData.avsRegistrations.some(({ isActive }: AVSRegistrations) => isActive);
    if (status === 1) {
      if (avsIndex === -1) {
        operatorData.avsRegistrations.push({
          address: avs.toLowerCase(),
          isActive: true,
        });
        operatorData.totalAvs = operatorData.totalAvs + 1 || 1;
      } else {
        if (operatorData.avsRegistrations[avsIndex].isActive === false) {
          operatorData.totalAvs = operatorData.totalAvs + 1 || 1;
        }
        operatorData.avsRegistrations[avsIndex].isActive = true;
      }
    } else if (status === 0) {
      if (avsIndex === -1) {
        operatorData.avsRegistrations.push({
          address: avs.toLowerCase(),
          isActive: false,
        });
      } else {
        if (operatorData.avsRegistrations[avsIndex].isActive === true) {
          operatorData.totalAvs = operatorData.totalAvs > 0 ? operatorData.totalAvs - 1 || 0 : 0;
        }
        operatorData.avsRegistrations[avsIndex].isActive = false;
      }
    }

    const isOperatorActive = operatorData.avsRegistrations.some(({ isActive }: AVSRegistrations) => isActive);

    await operatorDb.save(operatorData);

    if (isOperatorWasActive && !isOperatorActive) {
      await updateStats(statsDb, "totalActiveOperators", 1, "subtract");
    } else if (!isOperatorWasActive && isOperatorActive) {
      await updateStats(statsDb, "totalActiveOperators", 1, "add");
    }
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
      totalStakers: 0,
      totalAvs: status === 1 ? 1 : 0,
      metadataURI: "",
      metadataName: "",
      metadataDescription: "",
      metadataLogo: "",
      metadataWebsite: "",
      metadataTelegram: "",
      metadataX: "",
      metadataDiscord: "",
      isMetadataSynced: false,
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });

    await updateStats(statsDb, "totalRegisteredOperators", 1, "add");
  }
};
