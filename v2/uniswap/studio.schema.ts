const Pair = {
  name: "Pair",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    token0: "string?",
    token1: "string?",
    pair: "string?",
    timestamp: "string?",
  },
};

const Swap = {
  name: "Swap",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    sender: "string?",
    amount0In: "string?",
    amount1In: "string?",
    amount0Out: "string?",
    amount1Out: "string?",
    to: "string?",
    pair: "string?",
  },
};

module.exports = { Pair, Swap };
