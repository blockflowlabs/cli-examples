import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { DOMAINS } from "../utils/domains";
import { chainIdToDomain } from "../utils/helper";
import { DomainsTable, IDomainsTable } from "../types/schema";

/**
 * @dev Event::SetBurnLimitPerMessage(address token, uint256 burnLimitPerMessage)
 * @param context trigger object with contains {event: {token ,burnLimitPerMessage }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SetBurnLimitPerMessageHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  const { event, transaction, block, log } = context;
  const { token, burnLimitPerMessage, nonce } = event;

  const domainmetadata = DOMAINS[chainIdToDomain[block.chain_id]];
  const domainDB: Instance = bind(DomainsTable);

  let domain: IDomainsTable = await domainDB.findOne({
    id: block.chain_id,
  });

  if (!domain) {
    domain ??= await domainDB.create({
      id: block.chain_id,
      domainName: domainmetadata.domainName.toString(),
      chainid: domainmetadata.chainId,
      tokenAddress: token.toString(),
      permessageburnlimit: burnLimitPerMessage.toString(),
    });
  }

  domain.domainName = domainmetadata.domainName.toString();
  domain.chainid = domainmetadata.chainId;
  domain.tokenAddress = token.toString();
  domain.permessageburnlimit = burnLimitPerMessage.toString();

  await domainDB.save(domain);
};
