import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoTransfer, LidoTransfer } from "../../../types/schema";
import { _loadLidoTransferEntity } from "../../../helpers";

/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param context trigger object with contains {event: {from ,to ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Transfer here

  const { event, transaction, block, log } = context;
  const { from, to, value } = event;

  const lidoTransferDB: Instance = bind(LidoTransfer);

  const transfer: ILidoTransfer = await _loadLidoTransferEntity(
    lidoTransferDB,
    context
  );

  await lidoTransferDB.save(transfer);
};
