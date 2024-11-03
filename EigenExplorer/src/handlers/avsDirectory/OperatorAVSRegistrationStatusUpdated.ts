import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Operator, AVS, AvsOperator, Stats, OperatorHistory } from "../../types/generated";
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

  const client = Instance.PostgresClient(bind);
  const operatorDb = client.db(Operator);
  const avsDb = client.db(AVS);
  const avsOperatorDb = client.db(AvsOperator);
  const statsDb = client.db(Stats);

  const operatorData = await operatorDb.load({ address: operator.toLowerCase() });
  const avsData = await avsDb.load({ address: avs.toLowerCase() });
  const avsOperatorData = await avsOperatorDb.load({ rowId: avsOperatorId });
  const operatorHistoryDb = client.db(OperatorHistory);

  const operatorHistoryId = `${operator}_${transaction.transaction_hash}`.toLowerCase();

  await operatorHistoryDb.save({
    rowId: operatorHistoryId,
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
    await avsOperatorDb.save({
      rowId: avsOperatorId,
      avsAddress: avs.toLowerCase(),
      operatorAddress: operator.toLowerCase(),
      isActive: status === 1,
      createdAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAt: block.block_timestamp,
      updatedAtBlock: block.block_number,
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
      ({ address, isActive }: any) => address === avs.toLowerCase(),
    );

    const isOperatorWasActive = operatorData.avsRegistrations.some(({ isActive }: any) => isActive);
    if (status === 1) {
      if (avsIndex === -1) {
        operatorData.avsRegistrations.push({
          address: avs.toLowerCase(),
          isActive: true,
        });
        operatorData.totalAvs = Number(operatorData.totalAvs) + 1 || 1;
      } else {
        if (operatorData.avsRegistrations[avsIndex].isActive === false) {
          operatorData.totalAvs = Number(operatorData.totalAvs) + 1 || 1;
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
          operatorData.totalAvs = operatorData.totalAvs > 0 ? Number(operatorData.totalAvs) - 1 || 0 : 0;
        }
        operatorData.avsRegistrations[avsIndex].isActive = false;
      }
    }

    const isOperatorActive = operatorData.avsRegistrations.some(({ isActive }: any) => isActive);

    await operatorDb.save(operatorData);

    if (isOperatorWasActive && !isOperatorActive) {
      await updateStats(statsDb, "totalActiveOperators", 1, "subtract");
    } else if (!isOperatorWasActive && isOperatorActive) {
      await updateStats(statsDb, "totalActiveOperators", 1, "add");
    }
  } else {
    await operatorDb.save({
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
