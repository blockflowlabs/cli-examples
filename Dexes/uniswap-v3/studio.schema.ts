import { String } from "@blockflow-labs/utils";

export interface UniIncentive {
  id: String;
  rewardToken: String;
  pool: String;
  startTime: number;
  endTime: number;
  refundee: String;
  reward: number;
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
