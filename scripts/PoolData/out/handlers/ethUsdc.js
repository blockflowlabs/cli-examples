"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferHandler = exports.SyncHandler = exports.SwapHandler = exports.MintHandler = exports.BurnHandler = exports.ApprovalHandler = void 0;
/**
 * @dev Event::Approval(address owner, address spender, uint256 value)
 * @param instance database [key, value]
 * @param event trigger object with keys [owner ,spender ,value ]
 */
const ApprovalHandler = (db, event) => {
    // To init a variable in database instance
    // if(!db['from']) db['from'] = {}
    // To get variable in database instance
    // let from = db['from']
    // To update a variable in database instance
    // db['from'] = event.from || event.arg0 || event['0']
    // Implement your event handler logic for Approval here
};
exports.ApprovalHandler = ApprovalHandler;
/**
 * @dev Event::Burn(address sender, uint256 amount0, uint256 amount1, address to)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0 ,amount1 ,to ]
 */
const BurnHandler = (db, event) => {
    // To init a variable in database instance
    if (!db["burns"])
        db["burns"] = [];
    // To get variable in database instance
    let burns = db["burns"];
    // Implement your event handler logic for Burn here
    burns.push({
        pair: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
        token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        token0Symbol: "USDC",
        token1Symbol: "WETH",
        amount0: event.amount0,
        amount1: event.amount1,
    });
    // To update a variable in database instance
    db["burns"] = burns;
};
exports.BurnHandler = BurnHandler;
/**
 * @dev Event::Mint(address sender, uint256 amount0, uint256 amount1)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0 ,amount1 ]
 */
const MintHandler = (db, event) => {
    // To init a variable in database instance
    if (!db["mints"])
        db["mints"] = [];
    // To get variable in database instance
    let mints = db["mints"];
    // Implement your event handler logic for Mint here
    mints.push({
        pair: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
        token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        token0Symbol: "USDC",
        token1Symbol: "WETH",
        amount0: event.amount0,
        amount1: event.amount1,
    });
    // To update a variable in database instance
    db["mints"] = mints;
};
exports.MintHandler = MintHandler;
/**
 * @dev Event::Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0In ,amount1In ,amount0Out ,amount1Out ,to ]
 */
const SwapHandler = (db, event) => {
    // To init a variable in database instance
    if (!db["swaps"])
        db["swaps"] = [];
    // To get variable in database instance
    let swaps = db["swaps"];
    // Implement your event handler logic for Swap here
    swaps.push({
        pair: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
        token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        token0Symbol: "USDC",
        token1Symbol: "WETH",
        amount0In: event.amount0In,
        amount1In: event.amount1In,
        amount0Out: event.amount0Out,
        amount1Out: event.amount1Out,
    });
    // To update a variable in database instance
    db["swaps"] = swaps;
};
exports.SwapHandler = SwapHandler;
/**
 * @dev Event::Sync(uint112 reserve0, uint112 reserve1)
 * @param instance database [key, value]
 * @param event trigger object with keys [reserve0 ,reserve1 ]
 */
const SyncHandler = (db, event) => {
    // To init a variable in database instance
    // if(!db['from']) db['from'] = {}
    // To get variable in database instance
    // let from = db['from']
    // To update a variable in database instance
    // db['from'] = event.from || event.arg0 || event['0']
    // Implement your event handler logic for Sync here
};
exports.SyncHandler = SyncHandler;
/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param instance database [key, value]
 * @param event trigger object with keys [from ,to ,value ]
 */
const TransferHandler = (db, event) => {
    // To init a variable in database instance
    // if(!db['from']) db['from'] = {}
    // To get variable in database instance
    // let from = db['from']
    // To update a variable in database instance
    // db['from'] = event.from || event.arg0 || event['0']
    // Implement your event handler logic for Transfer here
};
exports.TransferHandler = TransferHandler;
