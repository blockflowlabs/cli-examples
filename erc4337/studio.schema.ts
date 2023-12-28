interface UserOp {
  id: string; // keep this same as userOpHash
  userOpHash: string; // need to generate this
  // details inside the function call
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
  beneficiary: string;
  // extra details taken from event
  success: string;
  actualGasCost: string;
  actualGasUsed: string;
  // extra details
  transactionHash: string;
  blockNumber: string;
  blockTimeStamp: string;
  entryPoint: string;
}

interface Transaction {
  id: string; // keep this same as transaction hash
  transactionHash: string;
  userOpHashes: [string];
}

interface Block {
  id: string; // keep this same as block number
  blockNumber: string;
  transactionHashesWithUserOps: [string];
}
