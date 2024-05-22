import {
  IEventContext,
  IBind,
  IBlock,
  Instance,
  ILog,
  ISecrets,
  ITransaction,
} from "@blockflow-labs/utils";

/**
 * @dev Event::Transfer(address from, address to, uint256 tokenId)
 * @param context trigger object with contains {event: {from ,to ,tokenId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
import { BigNumber } from "bignumber.js";
import { Token, IToken } from "../../types/schema";
import { getTokenMetadata } from "../../utils/tokens";

export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context;
  const { from, to, tokenId } = event;

  const value = "1";
  const collectionAddress = log.log_address.toLowerCase();
  const tokenMetadata = getTokenMetadata(collectionAddress);

  //create a metadata variable here

  //binding to DB
  const tokenDB: Instance = bind(Token);

  let token: IToken = await tokenDB.findOne({
    id: tokenId,
  });

  token ??= await tokenDB.create({
    id: tokenId,
    collectionNFT: collectionAddress,
    tokenId: event.tokenId.toString(),
    tokenURI: tokenMetadata.tokenURI.toString(),
    owner: tokenMetadata.owner.toString() ,
    mintTime: block.block_timestamp
  });
  await tokenDB.save(token);
};
