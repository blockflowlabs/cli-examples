interface Transaction {
  id: string; // keep this same as transaction hash
  transactionHash: string;
  gasPrice: string;
  gasLimit: string;
  userOpHashes: [string];
}

interface Block {
  id: string; // keep this same as block number
  transactionHashesWithUserOps: [string];
  blockNumber: string;
}

interface AccountFactory {
  id: String;
  totalAccount: String;
  accounts: [String];
  blockNumber: String;
}

interface Account {
  id: String;
  ops: [String];
  paymaster: String;
  createdAt: String;
  updatedAt: String;
  createdHash: String;
  createdOpHash: String;
  totalOperations: String;
  factory: String;
}

interface Blockchain {
  id: String;
  totalAccount: String;
  totalOperations: String;
}

interface Paymaster {
  id: String;
  ops: [String];
  createdAt: String;
  updatedAt: String;
  totalOperations: String;
}

interface Bundler {
  id: String;
  ops: [String];
  createdAt: String;
  updatedAt: String;
  totalOperations: String;
}

interface UserOperationRevertReason {
  id: String;
  sender: String;
  nonce: Number;
  reason: String;
  txHash: String;
  block: String;
  createdAt: String;
}

interface UserOperation {
  // will get these from event data
  id: String; // userOp hash
  txHash: String;
  block: String;
  bundler: String;
  sender: String;
  paymaster: String;
  nonce: Number;
  success: Boolean;
  actualGasCost: Number;
  actualGasUsed: Number;
  createdAt: String;
  entryPoint: String;
  network: String;

  // Will get all these from function calldata
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
  ERC20TransferAmount: string;
  ERC20TransferFrom: string;
  ERC20TransferTo: string;
  ERC20Token: string;
}
