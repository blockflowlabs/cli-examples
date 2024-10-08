import { String } from "@blockflow-labs/utils";

export interface UniIncentive {
  id: String;
  rewardToken: String;
  pool: String;
  startTime: number;
  endTime: number;
  refundee: String;
  reward: String;
  ended: Boolean;
}

export interface UniPosition {
  id: String;
  tokenId: number;
  owner: String;
  liquidity: String;
  staked: Boolean;
  oldOwner: String;
  approved: String;
}

export interface UniReward {
  id: String;
  recipient: String;
  rewardToken: String;
  reward: String;
  rewardRecipientAddress: String;
}
