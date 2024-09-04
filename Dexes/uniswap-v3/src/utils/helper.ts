import { ethers } from "ethers";

export function getIncentiveId(incentiveTuple: any[]) {
  const coder = ethers.AbiCoder.defaultAbiCoder();
  const incentiveIdEncoded = coder.encode(
    ["address", "address", "uint256", "uint256", "address"],
    incentiveTuple
  );

  const incentiveId = ethers.keccak256(incentiveIdEncoded).toLowerCase();

  return incentiveId;
}
