import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { DomainsTable, IDomainsTable } from "../../types/schema";
import { getDomainMetadata } from "../../utils/domains";
import { hashNonceAndSourceDomain, getBlockchainName} from "../../utils/helper";
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
  const { token, burnLimitPerMessage,nonce } = event;

  let id = block.chain_id.toString();

const source_domain: string = getBlockchainName(id);

  let Id = hashNonceAndSourceDomain(nonce, source_domain)
  
  const domainmetadata = getDomainMetadata(Id);
  const domainDB: Instance = bind(DomainsTable);

  let domain: IDomainsTable = await domainDB.findOne({
    id: Id,
  });
   domain ??= await domainDB.create({
    id: Id,
    domainName : domainmetadata.domainName.toString() ,
    chainId : domainmetadata.chainId,
    tokenAddress : token.toString(),
    permessageburnlimit : burnLimitPerMessage.toString(),
    
   });
};
