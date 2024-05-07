import { AbiCoder, keccak256, Interface } from "ethers";

const Transfer_Shares_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "sharesValue", type: "uint256" },
    ],
    name: "TransferShares",
    type: "event",
  },
  {
    constant: false,
    inputs: [
      { name: "_recipient", type: "address" },
      { name: "_sharesAmount", type: "uint256" },
    ],
    name: "transferShares",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const EL_Rewards_Event_ABI = [
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "amount", type: "uint256" }],
    name: "ELRewardsReceived",
    type: "event",
  },
];

const Mev_Tx_Fee_Received_ABI = [
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "amount", type: "uint256" }],
    name: "MevTxFeeReceived",
    type: "event",
  },
];

export function decodeTransferShares(event: any) {
  const iface = new Interface(Transfer_Shares_ABI);
  return iface.parseLog({ topics: event.topics, data: event.log_data })?.args;
}

export function decodeELRewardsEvent(event: any) {
  const iface = new Interface(EL_Rewards_Event_ABI);
  return iface.parseLog({ topics: event.topics, data: event.log_data })?.args;
}

export function decodeMevTxFeeReceivedEvent(event: any) {
  const iface = new Interface(Mev_Tx_Fee_Received_ABI);
  return iface.parseLog({ topics: event.topics, data: event.log_data })?.args;
}

export function decodeTokenRebasedEvent(event: any) {
  const iface = new Interface(Transfer_Shares_ABI);
  return iface;
}
