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
    // if(!db['from']) db['from'] = {}
    // To get variable in database instance
    // let from = db['from']
    // To update a variable in database instance
    // db['from'] = event.from || event.arg0 || event['0']
    // Implement your event handler logic for Burn here
};
exports.BurnHandler = BurnHandler;
/**
 * @dev Event::Mint(address sender, uint256 amount0, uint256 amount1)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0 ,amount1 ]
 */
const MintHandler = (db, event) => {
    // To init a variable in database instance
    // if(!db['from']) db['from'] = {}
    // To get variable in database instance
    // let from = db['from']
    // To update a variable in database instance
    // db['from'] = event.from || event.arg0 || event['0']
    // Implement your event handler logic for Mint here
};
exports.MintHandler = MintHandler;
/**
 * @dev Event::Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0In ,amount1In ,amount0Out ,amount1Out ,to ]
 */
const SwapHandler = (db, event) => {
    // To init a variable in database instance
    // if(!db['from']) db['from'] = {}
    // To get variable in database instance
    // let from = db['from']
    // To update a variable in database instance
    // db['from'] = event.from || event.arg0 || event['0']
    // Implement your event handler logic for Swap here
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
