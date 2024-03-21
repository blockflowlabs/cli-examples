export interface CrossTransferSrc {
  id: string; // depositID_src_dst
  partnerId: string;
  depositId: string;
  depositor: string;
  recipient: string;

  srcTxHash: string;
  srcBlockNumber: string;
  srcTokenAmount: string;
  senderAddress: string;
  srcTxTime: string;
  srcTxStatus: string;
  srcChain: string;

  dstChain: string;
  dstToken: string;
  dstTokenAmount: string;
}

export interface CrossTransferDst {
  id: string; //depositID_src_dst
  recipient: string;

  depositId: string;
  destToken: string;
  dstAmount: string;
  srcChain: string;

  dstTxHash: string;
  dstTxTime: string;
  dstTxStatus: boolean;
  dstChain: string;
}
