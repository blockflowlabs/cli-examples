import {
    IEventContext,
    IBind,
    Instance,
    ISecrets,
  } from "@blockflow-labs/utils";
  
  import {
    attestationTable,
    IattestationTable,
    mintTransactionsTable,
    ImintTransactionsTable,
    FeeInfo,
    IFeeInfo
  } from "../types/schema";
  import {
    MESSAGE_RECEIVE_SIG,
    decodereceivemessage,
    MINT_AND_WITHDRAW_TOPIC0,
  } from '../utils/helper'
  import { chainIdToDomain, domainToChainId } from "../utils/helper";
  
  /**
   * @dev Event::MessageReceived(address caller, uint32 sourceDomain, uint64 nonce, bytes32 sender, bytes messageBody)
   * @param context trigger object with contains {event: {caller ,sourceDomain ,nonce ,sender ,messageBody }, transaction, block, log}
   * @param bind init function for database wrapper methods
   */
  export const MessageReceivedHandler = async (
    context: IEventContext,
    bind: IBind,
    secrets: ISecrets
  ) => {
    // Implement your event handler logic for MessageReceived here
    const { event, transaction, block, log } = context;
    const { caller, sourceDomain, nonce, sender, messageBody } = event;
  
    const srcChainId = domainToChainId[sourceDomain];
    const feeinUSDId = block.chain_id
    let amountDestination = ''
    let attestationdata = ''

    const isMintAndWithdraw = transaction.logs
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === MINT_AND_WITHDRAW_TOPIC0,
      )
    : null
     if (isMintAndWithdraw) {
    amountDestination = isMintAndWithdraw.log_data
     }

    const amount = parseInt(amountDestination, 10)
    const amountSource = parseInt(transaction.transaction_value, 10)
  
    const mintId = `${nonce.toString()}_${srcChainId}_${block.chain_id.toString()}`;
  
    const minttransactionDB: Instance = bind(mintTransactionsTable);
  
    let minttransaction: ImintTransactionsTable = await minttransactionDB.findOne(
      {
        id: mintId,
      }
    );
  
    minttransaction ??= await minttransactionDB.create({
      id: mintId,
      amount: amount,
      transactionHash: transaction.transaction_hash,
      sourceDomain: sourceDomain,
      destinationDomain: chainIdToDomain[block.chain_id],
      mintRecipient: caller,
      timeStamp: block.block_timestamp,
    });

    const messagereceivesig = MESSAGE_RECEIVE_SIG.includes(
      transaction.transaction_input.slice(0, 10),
    )
    if (messagereceivesig) {
      const decodeTx: any = decodereceivemessage(
        transaction.transaction_input,
        transaction.transaction_value,
      )
      attestationdata = decodeTx[1]
    }
  
    const attestationDB: Instance = bind(attestationTable);
  
    let attestation: IattestationTable = await attestationDB.findOne({
      id: mintId,
    });
  
    attestation ??= await attestationDB.create({
      id: mintId,
      attestation: attestationdata.toString(),
      messageHash: messageBody.toString(),
      timeStamp: block.block_timestamp,
    });

    const feeamount = amountSource - amount
    const FeeInfoDB: Instance = bind(FeeInfo)
   let feeinfo: IFeeInfo = await FeeInfoDB.findOne({
    id: feeinUSDId,
   })
   if (feeinfo) {
    feeinfo.feeInUSDC += feeamount
    await FeeInfoDB.save(feeinfo)
   } else {
    feeinfo = await FeeInfoDB.create({
      id: feeinUSDId,
      feeInUSDC: feeamount,
    })
    await FeeInfoDB.save(feeinfo)
   }
   return feeinfo
  };

  