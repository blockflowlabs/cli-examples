export const Pair = {
  "name": "XXXX-XXXX-XXXX-XXXX-Pair",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "token0": "string?",
    "token1": "string?",
    "pair": "string?",
    "timestamp": "string?"
  },
  "reorg": true
};

export interface IPair {
  token0?: string;
  token1?: string;
  pair?: string;
  timestamp?: string;
}

export const Swap = {
  "name": "XXXX-XXXX-XXXX-XXXX-Swap",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "sender": "string?",
    "amount0In": "string?",
    "amount1In": "string?",
    "amount0Out": "string?",
    "amount1Out": "string?",
    "to": "string?",
    "pair": "string?"
  },
  "reorg": true
};

export interface ISwap {
  sender?: string;
  amount0In?: string;
  amount1In?: string;
  amount0Out?: string;
  amount1Out?: string;
  to?: string;
  pair?: string;
}

