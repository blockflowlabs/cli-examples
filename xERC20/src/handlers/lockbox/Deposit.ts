import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { LockBoxData } from "../../types/schema";
import { WithdrawHandler } from "./Withdraw";

/**
 * @dev Event::Deposit(address _sender, uint256 _amount)
 * @param context trigger object with contains {event: {_sender ,_amount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Deposit here

  const { event, transaction, block, log } = context;
  const { _sender, _amount } = event;

  const id= `${log.log_address}-${_sender}`;

  const lockboxdataDB: Instance = bind(LockBoxData);
  let lockboxdata = await lockboxdataDB.findOne({
    id:id
  })
  if(!lockboxdata){
    await lockboxdataDB.create({
      id:id,
      lockboxaddress: log.log_address,
      senderAccount: _sender,
      depositedAmount: _amount,
      withdrawnAmount: 0,
      netAmount: _amount
    })
  }
  else{
    lockboxdata.depositedAmount += _amount;
    lockboxdata.netAmount+= _amount;
    await lockboxdataDB.save(lockboxdata);
  }
};
