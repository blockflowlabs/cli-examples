import { keccak256 } from "@ethersproject/keccak256";
import { defaultAbiCoder } from "@ethersproject/abi";

function pack(userOp: any) {
  const sender = userOp.sender;
  const nonce = userOp.nonce;
  const hashInitCode = keccak256(userOp.initCode);
  const hashCallData = keccak256(userOp.callData);
  const callGasLimit = userOp.callGasLimit;
  const verificationGasLimit = userOp.verificationGasLimit;
  const preVerificationGas = userOp.preVerificationGas;
  const maxFeePerGas = userOp.maxFeePerGas;
  const maxPriorityFeePerGas = userOp.maxPriorityFeePerGas;
  const hashPaymasterAndData = keccak256(userOp.paymasterAndData);

  const types = [
    "address",
    "uint256",
    "bytes32",
    "bytes32",
    "uint256",
    "uint256",
    "uint256",
    "uint256",
    "uint256",
    "bytes32",
  ];
  const values = [
    sender,
    nonce,
    hashInitCode,
    hashCallData,
    callGasLimit,
    verificationGasLimit,
    preVerificationGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    hashPaymasterAndData,
  ];

  return defaultAbiCoder.encode(types, values);
}

function getUserOpHash(userOp: any, entryPointAddr: string, chainId: string) {
  // Hash the packed data
  const hashedUserOp = keccak256(pack(userOp));

  // Correct the types to match the values being encoded
  const types = ["bytes32", "address", "uint256"];
  const values = [hashedUserOp, entryPointAddr, chainId];

  // Encode and hash again
  const encoded = defaultAbiCoder.encode(types, values);
  return keccak256(encoded);
}

export default getUserOpHash;
