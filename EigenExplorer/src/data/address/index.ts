import { eigenContracts } from "./eigenMainnetContracts";

export interface EigenStrategiesContractAddress {
  Eigen?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  WETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  cbETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  stETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  rETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  ETHx?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  ankrETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  oETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  osETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  swETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  wBETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  sfrxETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  lsETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
  mETH?: { strategyContract: `0x${string}`; tokenContract: `0x${string}` };
}

export interface EigenContractAddress {
  AVSDirectory: `0x${string}`;
  DelegationManager: `0x${string}`;
  Slasher: `0x${string}`;
  StrategyManager: `0x${string}`;
  EigenPodManager: `0x${string}`;

  Strategies: EigenStrategiesContractAddress;
}

export { eigenContracts };
