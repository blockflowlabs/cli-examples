// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

export class UserOp {
  static entity = "UserOp";
  static entityId = "bb7e8518-8ed2-4813-bc46-697c42a86d44";
  static schema = {
    id: "string",
    userOpHash: "string",
    sender: "string",
    nonce: "string",
    initCode: "string",
    callData: "string",
    callGasLimit: "string",
    verificationGasLimit: "string",
    preVerificationGas: "string",
    maxFeePerGas: "string",
    maxPriorityFeePerGas: "string",
    paymasterAndData: "string",
    signature: "string",
    beneficiary: "string",
    success: "string",
    actualGasCost: "string",
    actualGasUsed: "string",
    transactionHash: "string",
    blockNumber: "string",
    blockTimeStamp: "string",
    entryPoint: "string",
    entityId: "String",
    blocknumber: { type: "String", index: true },
  };

  static async save(data: any, callback: Function): Promise<void> {
    data.entityId = UserOp.entityId;
    await callback(UserOp.entity, UserOp.schema, data);
  }

  static async load(id: string, callback: Function): Promise<any> {
    const res = await callback(UserOp.entity, UserOp.schema, id);
    res.id = id;
    return res;
  }

  static async bind(): Promise<UserOp> {
    return new UserOp();
  }
}

export class Transaction {
  static entity = "Transaction";
  static entityId = "96037943-c6b3-4a6f-ac22-fc571fde1375";
  static schema = {
    id: "string",
    transactionHash: "string",
    userOpHashes: ["string"],
    entityId: "String",
    blocknumber: { type: "String", index: true },
  };

  static async save(data: any, callback: Function): Promise<void> {
    data.entityId = Transaction.entityId;
    await callback(Transaction.entity, Transaction.schema, data);
  }

  static async load(id: string, callback: Function): Promise<any> {
    const res = await callback(Transaction.entity, Transaction.schema, id);
    res.id = id;
    return res;
  }

  static async bind(): Promise<Transaction> {
    return new Transaction();
  }
}

export class Block {
  static entity = "Block";
  static entityId = "0a79abf8-8840-4900-976c-432ef9e6f134";
  static schema = {
    id: "string",
    blockNumber: "string",
    transactionHashesWithUserOps: ["string"],
    entityId: "String",
    blocknumber: { type: "String", index: true },
  };

  static async save(data: any, callback: Function): Promise<void> {
    data.entityId = Block.entityId;
    await callback(Block.entity, Block.schema, data);
  }

  static async load(id: string, callback: Function): Promise<any> {
    const res = await callback(Block.entity, Block.schema, id);
    res.id = id;
    return res;
  }

  static async bind(): Promise<Block> {
    return new Block();
  }
}
