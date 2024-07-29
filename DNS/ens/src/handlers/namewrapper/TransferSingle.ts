import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  Account,
  Domain,
  Registration,
  WrappedDomain,
  wrappedTransfer,
} from "../../types/schema";
import {
  toHexString,
  createorloadaccount,
  createorloaddomain,
} from "../../utils/helper";
/**
 * @dev Event::TransferSingle(address operator, address from, address to, uint256 id, uint256 value)
 * @param context trigger object with contains {event: {operator ,from ,to ,id ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferSingleHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for TransferSingle here
  const { event, transaction, block, log } = context;
  const { operator, from, to, id, value } = event;
  const accountDB: Instance = bind(Account);
  const domainDB: Instance = bind(Domain);
  const wrappeddomainDB: Instance = bind(WrappedDomain);
    const _to = createorloadaccount(accountDB, to, bind);
    const namehash = toHexString(operator);
    const domain = createorloaddomain(
      domainDB,
      namehash,
      block.block_timestamp,
      bind,
    );
    let wrappeDDomain = await wrappeddomainDB.findOne({
      id:namehash
    });
    wrappeDDomain ??=
      await wrappeddomainDB.create({
        id: namehash,
        expiryDate: 0,
        fuses: 0,
        name: "",
      });
};








