import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { DomainsTable, IDomainsTable } from "../../types/schema";
import { getDomainMetadata } from "../../utils/domains";

/**
 * @dev Event::SetBurnLimitPerMessage(address token, uint256 burnLimitPerMessage)
 * @param context trigger object with contains {event: {token ,burnLimitPerMessage }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SetBurnLimitPerMessageHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {

  const { event, transaction, block, log } = context;
  const { token, burnLimitPerMessage } = event;

  let id = block.chain_id.toString();

  const domainmetadata = getDomainMetadata(id);
  const domainDB: Instance = bind(DomainsTable);

  let domain: IDomainsTable = await domainDB.findOne({
    id: id,
  });
   domain ??= await domainDB.create({
    id: id,
    domainName : domainmetadata.domainName.toString() ,
    chainId : domainmetadata.chainId,
    tokenAddress : token.toString(),
    minterAllowance :  ,
    permessageburnlimit : burnLimitPerMessage.toString(),
    
   });
};
