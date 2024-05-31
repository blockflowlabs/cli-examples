import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  APP_REPOS,
  KERNEL_APP_BASES_NAMESPACE,
  ZERO_ADDRESS,
} from "../../../constants";
import { ILidoAppVersion, LidoAppVersion } from "../../../types/schema";

/**
 * @dev Event::SetApp(bytes32 namespace, bytes32 appId, address app)
 * @param context trigger object with contains {event: {namespace ,appId ,app }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SetAppHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for SetApp here

  const { event, transaction, block, log } = context;
  const { namespace, appId, app } = event;

  if (namespace == KERNEL_APP_BASES_NAMESPACE) {
    const repoAddr: string = APP_REPOS[appId.toString().toLowerCase()];

    if (repoAddr) {
      const lidoAppVersionDB = bind(LidoAppVersion);
      let entity: ILidoAppVersion = await lidoAppVersionDB.findOne({
        id: appId,
      });
      if (!entity) {
        entity = await lidoAppVersionDB.create({ id: appId });
        entity.impl = ZERO_ADDRESS;
      }
      if (entity.impl != app) {
        //major-minor-patch missing
        entity.impl = app;
        entity.block_timestamp = block.block_timestamp;
        entity.transaction_hash = transaction.transaction_hash;
        entity.log_index = log.log_index;
        await lidoAppVersionDB.save(entity);
      }
    }
  }
};
