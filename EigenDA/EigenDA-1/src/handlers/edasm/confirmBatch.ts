import {
  IFunctionContext,
  IBind,
  ISecrets,
  Instance,
} from "@blockflow-labs/utils";

import {
  hexStringToBigIntArray,
  ComputeSignatoryRecordHash,
} from "../../utils";

import { BatchHeader, IBatchHeader } from "../../types/schema";

import { NonSigning, INonSigning } from "../../types/schema";

import { Operator, IOperator } from "../../types/schema";

import { G1Point } from "../../utils/g1";
/**
 * @dev Function::confirmBatch(tuple batchHeader, tuple nonSignerStakesAndSignature)
 * @param context trigger object with contains {functionParams: {batchHeader ,nonSignerStakesAndSignature }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const ConfirmBatchHandler = async (
  context: IFunctionContext,
  bind: IBind,
  secrets: ISecrets
) => {
  const { functionParams, transaction, block } = context;
  const { batchHeader, nonSignerStakesAndSignature } = functionParams;

  const batchHeaderDB: Instance = bind(BatchHeader);
  const nonSigningDB: Instance = bind(NonSigning);
  const operatorDB: Instance = bind(Operator);

  let id = transaction.transaction_hash;

  let batchHeaderEntity: IBatchHeader = await batchHeaderDB.findOne({ id: id });

  batchHeaderEntity ??= await batchHeaderDB.create({
    id: id,
    blob_headers_root: batchHeader.blobHeadersRoot,
    quorum_numbers: hexStringToBigIntArray(
      batchHeader.quorumNumbers.toString()
    ),
    signed_stake_for_quorums: hexStringToBigIntArray(
      batchHeader.signedStakeForQuorums.toString()
    ),
    reference_blocknumber: batchHeader.referenceBlockNumber,
    batch: id,
  });

  let nonSigners: string[] = [];

  for (
    let index = 0;
    index < nonSignerStakesAndSignature.nonSignerPubkeys.length;
    index++
  ) {
    const pubKey = nonSignerStakesAndSignature.nonSignerPubkeys[index];

    const point = new G1Point(pubKey);

    let operatorId = point.getOperatorID();

    let operatorEntity: IOperator = await operatorDB.findOne({
      id: operatorId,
    });

    if (operatorEntity) {
      operatorEntity.non_signings.push(id);
      await operatorDB.save(operatorEntity);
    } else {
      await operatorDB.create({
        id: operatorId,
        operator_id: operatorId,
        non_signings: [id],
      });
    }
  }

  let signatoryRecordHash = ComputeSignatoryRecordHash(
    parseInt(batchHeader.referenceBlockNumber.toString()),
    nonSignerStakesAndSignature.nonSignerPubkeys
  );

  let nonSigningEntity: INonSigning = await nonSigningDB.findOne({ id: id });

  nonSigningEntity ??= await nonSigningDB.create({
    id: id,
    batch: id,
    non_signers: nonSigners,
    signatory_record_hash: signatoryRecordHash,
  });
};
