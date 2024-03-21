import { ABind, API } from "@blockflow-labs/utils";

import { getChainId } from "../../utils/helper";
import {
  CrossTransferSrc,
  CrossTransferDst,
  ICrossTransferSrc,
  ICrossTransferDst,
} from "../../types/schema";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const transactionsHandler = async (
  context: any,
  bind: ABind,
  secrets: Record<string, string>
) => {
  // Implement your function handler logic for API here
  let { request, response } = context;

  // request contains query object. To access user query params use
  let { src, dst, page } = request.query;

  const srcChainId = getChainId(src);
  if (!srcChainId) {
    response.error = "src not supported";
    return response;
  }

  const dstChainId = getChainId(dst);
  if (!dstChainId) {
    response.error = "dst not supported";
    return response;
  }

  const srcDB: API = bind(CrossTransferSrc);
  const dstDB: API = bind(CrossTransferDst);

  const limit = 100;
  const skip = (page - 1) * limit;

  const srcTransations: Array<ICrossTransferSrc> = await srcDB.find(
    { srcChain: srcChainId, dstChain: dstChainId },
    {},
    {
      skip: skip,
      limit: limit,
    }
  );

  if (srcTransations.length === 0)
    response.error = "src documents not found, try changing page";

  response = {
    src,
    dst,
    transactions: [],
    page,
  };

  // Extract the deposit IDs from the source transactions
  const depositIds = srcTransations.map((srcTx) => srcTx.id);

  // Fetch the destination transactions based on the deposit IDs
  const dstTransactions: Array<ICrossTransferDst> = await dstDB.find(
    {
      id: { $in: depositIds },
    },
    {},
    {}
  );

  // Create a map of destination transactions indexed by their ID
  const dstTransactionsMap: Record<string, ICrossTransferDst> = {};
  dstTransactions.forEach((dstTx) => (dstTransactionsMap[dstTx.id] = dstTx));

  const idsToReponse: any = {};

  for (const srcTx of srcTransations) {
    idsToReponse[srcTx.id] = {
      source: {
        srcChainId: srcChainId,
        partnerId: srcTx.partnerId,
        depositId: srcTx.depositId,
        depositor: srcTx.depositor,
        srcTxHash: srcTx.srcTxHash,
        srcBlockNumber: srcTx.srcBlockNumber,
        srcTokenAmount: srcTx.srcTokenAmount,
        senderAddress: srcTx.senderAddress,
        srcTxTime: srcTx.srcTxTime,
        srcTxStatus: srcTx.srcTxStatus,
        srcChain: srcTx.srcChain,
        dstChain: srcTx.dstChain,
        dstToken: srcTx.dstToken,
        dstTokenAmount: srcTx.dstTokenAmount,
        blocknumber: srcTx.blocknumber,
      },
      destination: {},
    };

    const dstTx = dstTransactionsMap[srcTx.id];
    if (dstTx) {
      idsToReponse[srcTx.id].destination = {
        depositId: dstTx.depositId,
        destToken: dstTx.destToken,
        dstAmount: dstTx.dstAmount,
        srcChain: dstTx.srcChain,
        dstTxHash: dstTx.dstTxHash,
        dstTxTime: dstTx.dstTxTime,
        dstTxStatus: dstTx.dstTxStatus,
        blocknumber: dstTx.blocknumber,
      };
    }
  }

  response.transactions = Object.values(idsToReponse);

  return response;
};
