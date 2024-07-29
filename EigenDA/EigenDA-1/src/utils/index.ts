import { G1Point } from "./g1";

import { createHash } from "crypto";

export function hexStringToBigIntArray(hexString: string): Number[] {
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  let result: Number[] = [];
  for (let i = 0; i < hexString.length; i += 2) {
    let byteHex = hexString.substring(i, i + 2);
    let byteValue = parseInt(byteHex, 16);
    result.push(byteValue);
  }

  return result;
}

export function ComputeSignatoryRecordHash(
  referenceBlockNumber: number,
  nonSignerKeys: any[],
): string {
  let buf = Buffer.alloc(4);
  buf.writeUInt32BE(referenceBlockNumber);

  for (const nonSignerKey of nonSignerKeys) {
    const point = new G1Point(nonSignerKey);
    let operatorHash = point.getOperatorID();
    const hashBuffer = Buffer.from(operatorHash, "hex");
    buf = Buffer.concat([buf, hashBuffer]);
  }

  const hasher = createHash("sha3-256");
  hasher.update(buf);
  return hasher.digest("hex").substring(0, 64);
}
