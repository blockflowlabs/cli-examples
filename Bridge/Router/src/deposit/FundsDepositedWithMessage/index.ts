import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";

import {
  hexToString,
  chainToContract,
  hashDepositDataWithMessage,
  stringToHex,
  getTokenInfo,
  SWAP_AND_DEPOSIT_SIGS,
  decodeSwapAndDeposit,
} from "../../utils/helper";
import { Source, FeeInfo } from "../../types/schema";

/**
 * @dev Event::FundsDepositedWithMessage(uint256 partnerId, uint256 amount, bytes32 destChainIdBytes, uint256 destAmount, uint256 depositId, address srcToken, bytes recipient, address depositor, bytes destToken, bytes message)
 * @param context trigger object with contains {event: {partnerId ,amount ,destChainIdBytes ,destAmount ,depositId ,srcToken ,recipient ,depositor ,destToken ,message }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsDepositedWithMessageHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for FundsDepositedWithMessage here
  const { event, transaction, block } = context;
  let {
    partnerId,
    amount,
    destChainIdBytes,
    destAmount,
    depositId,
    srcToken,
    recipient,
    depositor,
    destToken,
    message,
  } = event;

  // sanitising parameters
  {
    partnerId = partnerId.toString();
    amount = amount.toString();
    destChainIdBytes = destChainIdBytes.toString();
    destAmount = destAmount.toString();
    depositId = depositId.toString();
    srcToken = srcToken.toString();
    depositor = depositor.toString();
    recipient = recipient.toString();
    destToken = destToken.toString();
    message = message.toString();
  }

  const srcDB: Instance = bind(Source);
  const srcChain = block.chain_id;
  const dstChain = hexToString(destChainIdBytes);
  const feeDB: Instance = bind(FeeInfo);

  const tokenInfo = getTokenInfo(srcChain, srcToken);
  let messageHash = "0x";
  if (destToken === "0x") destToken = tokenInfo.token;

  try {
    messageHash = hashDepositDataWithMessage({
      amount,
      srcChainId: stringToHex(srcChain),
      depositId,
      destToken,
      recipient,
      contract: chainToContract(dstChain),
      message,
    });
  } catch (error) {}

  let tokenPath = {
    sourcetoken: {
      address: srcToken,
      amount: new BigNumber(amount)
        .dividedBy(
          new BigNumber(10).pow(tokenInfo.decimals || 0) // as decimals can be ""
        )
        .toString(),
      symbol: tokenInfo.symbol,
    },
    stableToken: {
      address: srcToken,
      amount: new BigNumber(amount)
        .dividedBy(
          new BigNumber(10).pow(tokenInfo.decimals || 0) // as decimals can be ""
        )
        .toString(),
      symbol: tokenInfo.symbol,
    },
  };

  const isSwapAndDeposit = SWAP_AND_DEPOSIT_SIGS.includes(
    transaction.transaction_input.slice(0, 10)
  );

  if (isSwapAndDeposit) {
    // https://etherscan.io/tx/0xc396afbd9f874a47b217a57fd74c46299bb79abd460700c01f4407ae166ca5e6
    const decodeTx: any = decodeSwapAndDeposit(
      transaction.transaction_input,
      transaction.transaction_value
    );

    const swapData = decodeTx[6];
    const [sourceToken, stableToken] = swapData[0];
    // prettier-ignore
    const [amountIn, amountOut] = [swapData[1].toString(), amount]
    tokenPath = {
      stableToken: {
        address: stableToken,
        amount: new BigNumber(amountOut)
          .dividedBy(
            new BigNumber(10).pow(
              getTokenInfo(srcChain, stableToken).decimals || 0
            )
          )
          .toString(),
        symbol: getTokenInfo(srcChain, stableToken).symbol,
      },
      sourcetoken: {
        address: sourceToken,
        amount: amountIn,
        symbol: getTokenInfo(srcChain, sourceToken).symbol,
      },
    };
  }

  const id = `${srcChain}_${dstChain}_${depositId}_${chainToContract(srcChain)}_${chainToContract(dstChain)}`; // messageHash.toLowerCase()

  // prettier-ignore
  // feetoken - stable token
  await feeDB.create({
    id: id.toLowerCase(),
    feeToken: {
      amount: new BigNumber(amount).minus(destAmount).dividedBy(new BigNumber(10).pow(getTokenInfo(dstChain, tokenPath.stableToken.address).decimals || 0)).toString(),
      symbol: getTokenInfo(dstChain, tokenPath.stableToken.address).symbol,
    },
    usdValue: "",
  });

  // create this receipt entry for src chain
  await srcDB.create({
    id: id.toLowerCase(), // message hash
    blocktimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    transactionHash: transaction.transaction_hash,
    sourcetoken: tokenPath.sourcetoken,
    stableToken: tokenPath.stableToken,
    depositorAddress: depositor,
    senderAddress: transaction.transaction_from_address,
    depositId: depositId,
    messageHash: messageHash,
    partnerId: partnerId,
    message: message,
    usdValue: "",
  });
};
