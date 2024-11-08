import { IEventContext, ISecrets } from "@blockflow-labs/utils";
import { getTokenMetadata } from "../types/util";
import { ITransfer, Transfer } from "../types/schema";
import { Instance } from "@blockflow-labs/sdk";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

/**
 * @dev Handles Transfer event for token transactions.
 * Extracts transfer details from the event, enriches it with token metadata,
 * and saves it to the database.
 *
 * @param context - Trigger object containing details of the event, transaction, block, and log.
 * @param bind - Initialization function for database wrapper methods.
 * @param secrets - Contains secrets for access control and configuration.
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: any,
  secrets: ISecrets
) => {
  try {
    // Destructure properties from the event context for easy access
    const { event, transaction, block, log } = context;

    // Extract the token address and normalize addresses for consistency
    const tokenAddress = log.log_address.toLowerCase();
    const fromAddress = event.from.toLowerCase();
    const toAddress = event.to.toLowerCase();
    const amount = event.value.toString();

    // Determine the type of transfer based on source and destination addresses
    const transferType =
      fromAddress === ZERO_ADDR
        ? "mint"
        : toAddress === ZERO_ADDR
          ? "burn"
          : "transfer";

    // Fetch token metadata to enrich the transfer details
    const tokenMetadata = await getTokenMetadata(tokenAddress);

    // Initialize database client and target Transfer table
    const client = Instance.PostgresClient(bind);
    const transferDB = client.db(Transfer);

    // Define the transfer object to store in the database
    let transfer: ITransfer = {
      from_address: fromAddress,
      to_address: toAddress,
      token_address: tokenAddress,
      token_name: tokenMetadata?.name || "Unknown",
      token_symbol: tokenMetadata?.symbol || "Unknown",
      raw_amount: amount,
      transfer_type: transferType,
      transaction_from_address: transaction.transaction_from_address,
      transaction_to_address: transaction.transaction_to_address,
      transaction_hash: transaction.transaction_hash,
      log_index: log.log_index.toString(),
      block_timestamp: block.block_timestamp.toString(),
    };

    // Save the transfer record in the database
    await transferDB.save(transfer);
    console.log(`Transfer saved: ${transaction.transaction_hash}`);
  } catch (error) {
    // Log error for debugging or notify monitoring services if needed
    console.error("Error handling Transfer event:", error);
  }
};
