import { IEventContext, IBind, Instance, ISecrets } from '@blockflow-labs/utils'

import { BigNumber } from 'bignumber.js'
import { getTokenMetadata } from '../../utils/tokens'

import { PriceDB, IPriceDB } from '../../types/schema'
import { chainlinkPair, IchainlinkPair } from '../../types/schema'
/**
 * @dev Event::AnswerUpdated(int256 current, uint256 roundId, uint256 updatedAt)
 * @param context trigger object with contains {event: {current ,roundId ,updatedAt }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PriceHandler = async (
  { event, transaction, block, log }: IEventContext,
  bind: IBind,
  _: ISecrets,
) => {
  const contractAddress = log.log_address.toLowerCase()
  const transanction_hash = transaction.transaction_hash.toString()

  const { current, roundId, updatedAt } = event

  const priceDB: Instance = bind(PriceDB)
  const chainlinkPairDB: Instance = bind(chainlinkPair)

  const tokenMetadata = getTokenMetadata(contractAddress)
  const entryId =
    `${transaction.transaction_hash.toString()}-${log.log_index.toString()}`.toLowerCase()
  let amount = new BigNumber(current)
    .dividedBy(10 ** tokenMetadata.decimals)
    .toString()

  let priceEntry: IPriceDB = await priceDB.findOne({
    id: entryId,
  })

  priceEntry ??= await priceDB.create({
    id: entryId,
    contractAddress,
    name: tokenMetadata.name,
    symbol: tokenMetadata.symbol,
    decimals: tokenMetadata.decimals,
    quoteCurrency: tokenMetadata.quoteCurrency,
    price: current,
    raw_price: amount,
  })
  await priceDB.save(priceEntry)

  const uniqueId = contractAddress
  const transaction_hash = transaction.transaction_hash.toString()

  let pairData: IchainlinkPair = await chainlinkPairDB.findOne({
    id: uniqueId.toLowerCase(),
  })

  pairData ??= await chainlinkPairDB.create({
    id: uniqueId,
  })
  pairData.roundId = roundId
  pairData.transanctionHash = transaction.transaction_hash
  pairData.lastBlockNumber = block.block_number
  pairData.updateCount += 1
  await chainlinkPairDB.save(pairData)
}
