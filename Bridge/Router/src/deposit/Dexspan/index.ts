import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import {
  hexToString,
  getTokenInfo,
  EventNameEnum,
  getDestTokenInfo,
} from "../../utils/helper";
import { Destination, Source } from "../../types/schema";
import { fetchTokenDetails } from "../../utils/token";
import { formatDecimals } from "../../utils/formatting";

/**
 * @dev Event::Swap(index_topic_1 string funcName, address[] tokenPath, uint256 amount, index_topic_2 address sender, index_topic_3 address receiver, uint256 finalAmt, uint256[] flags, uint256 widgetID)
 * @param context trigger object with contains {event: {partnerId ,amount ,destChainIdBytes ,destAmount ,depositId ,srcToken ,depositor ,recipient ,destToken }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SwapHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your event handler logic for FundsDeposited here
  const { event, transaction, block } = context;

  let {
    tokenPath,
    amount: srcAmount,
    sender,
    receiver,
    finalAmt: destAmount,
    widgetID,
  } = event;

  // sanitising parameters
  {
    srcAmount = srcAmount.toString();
    destAmount = destAmount.toString();
    widgetID = widgetID.toString();
  }

  const srcDB: Instance = bind(Source);
  const srcChain = block.chain_id;

  const [stableTokenInfo, stableDestTokenInfo] = await Promise.all([
    fetchTokenDetails(bind, srcChain, tokenPath[0]),
    fetchTokenDetails(bind, srcChain, tokenPath[1]),
  ]);
  const id = `${srcChain}_${transaction.transaction_hash}`;

  const tokenList = {
    sourceToken: {
      amount: formatDecimals(srcAmount, stableTokenInfo.decimals),
      tokenRef: stableTokenInfo._id,
    },
    stableToken: {
      amount: formatDecimals(srcAmount, stableTokenInfo.decimals),
      tokenRef: stableTokenInfo._id,
    },
    stableDestToken: {
      amount: formatDecimals(destAmount, stableTokenInfo.decimals),
      tokenRef: stableDestTokenInfo._id,
    },
  };

  const srcObj: any = {
    id: id.toLowerCase(), // message hash
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    destChainId: srcChain,
    transactionHash: transaction.transaction_hash,
    eventName: EventNameEnum.Swap,
    sourceToken: tokenList.sourceToken,
    stableToken: tokenList.stableToken,
    stableDestToken: tokenList.stableDestToken,
    depositorAddress: sender, // Contract from where txn came
    senderAddress: transaction.transaction_from_address, // Who triggered the transaction
    depositId: "",
    partnerId: widgetID,
    message: "", // fundDepositWithMessage
    usdValue: (
      stableTokenInfo.priceUsd * parseFloat(tokenList.stableToken.amount)
    ).toFixed(4),
    fee: {
      tokenRef: tokenList.stableToken.tokenRef,
      amount:
        parseFloat(tokenList.stableToken.amount) -
        parseFloat(tokenList.stableToken.amount),
    },
    recipientAddress: receiver,
  };
  await srcDB.save(srcObj);
};
