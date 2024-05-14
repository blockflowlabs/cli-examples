import {
    IEventContext,
    IBind,
    Instance,
    ISecrets,
  } from "@blockflow-labs/utils";

  import {chainlink_pair, Ichainlink_pair} from  "../../types/schema";
  /**
 * @dev Event::AnswerUpdated(int256 current, uint256 roundId, uint256 updatedAt)
 * @param context trigger object with contains {event: {current ,roundId ,updatedAt }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
  export const AnswerUpdatedHandler = async (
    context: IEventContext,
    bind: IBind,
    secrets: ISecrets,
  ) => {
    // Implement your event handler logic for AnswerUpdated here
    const { event, transaction, block, log } = context;
    const { update_count, transanction_hash,last_block_number,round_id,impl_update } = event;
  };  

   const chainlink_pairDB: Instance = bind(chainlink_pair);
   const $chainlink_pair = await chainlink_pairDB.findOne({id: `${transaction.transaction_hash} - ${log.log_index}`.toLowerCase()})



