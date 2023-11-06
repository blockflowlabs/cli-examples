"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferHandler = exports.ApprovalHandler = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
/**
 * @dev Event::Approval(address src, address guy, uint256 wad)
 * @param instance database [key, value]
 * @param event trigger object with keys [src ,guy ,wad ]
 */
const ApprovalHandler = (db, event) => {
    // To init a variable in database instance
    if (!db["approvals"])
        db["approvals"] = {};
    if (!db["approvals"][event["arg1"]])
        db["approvals"][event["arg1"]] = {};
    if (!db["approvals"][event["arg2"]])
        db["approvals"][event["arg2"]] = {};
    // Initialise the owner -> spender mapping
    if (!db["approvals"][event["arg1"]][event["arg2"]])
        db["approvals"][event["arg1"]][event["arg2"]] = new bignumber_js_1.default(0).toString();
    // Initialise the spender -> owner mapping
    if (!db["approvals"][event["arg2"]][event["arg1"]])
        db["approvals"][event["arg2"]][event["arg1"]] = new bignumber_js_1.default(0).toString();
    // To get variable in database instance
    let owner = db["approvals"][event["arg1"]];
    let spender = db["approvals"][event["arg2"]];
    // Implement your event handler logic for Approval here
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    if (event["arg1"] !== zeroAddress && event["arg2"] !== zeroAddress) {
        let value = new bignumber_js_1.default(event["arg3"] || 0).toString();
        owner[event["arg2"]] = value; //  How much allowance owner has given to a particular spender
        spender[event["arg1"]] = value; // How much allowance spender has by particular owner
    }
    // To update a variable in database instance
    db["approvals"][event["arg1"]] = owner;
    db["approvals"][event["arg2"]] = spender;
};
exports.ApprovalHandler = ApprovalHandler;
/**
 * @dev Event::Transfer(address src, address dst, uint256 wad)
 * @param instance database [key, value]
 * @param event trigger object with keys [src ,dst ,wad ]
 */
const TransferHandler = (db, event) => {
    // To init a variable in database instance
    if (!db["totalSupply"])
        db["totalSupply"] = "0";
    if (!db["balances"])
        db["balances"] = {};
    // To get variable in database instance
    let totalSupply = new bignumber_js_1.default(db["totalSupply"] || 0);
    let balances = db["balances"];
    // Implement your event handler logic for Transfer here
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    if (event["arg1"] === zeroAddress) {
        let toBalance = new bignumber_js_1.default(balances[event["arg2"]] || 0);
        let value = new bignumber_js_1.default(event["arg3"] || 0);
        toBalance = toBalance.plus(value);
        totalSupply = totalSupply.plus(value);
        balances[event["arg2"]] = toBalance.toString();
    }
    else if (event["arg2"] === zeroAddress) {
        let fromBalance = new bignumber_js_1.default(balances[event["arg1"]] || 0);
        let value = new bignumber_js_1.default(event["arg3"] || 0);
        fromBalance = fromBalance.minus(value);
        totalSupply = totalSupply.minus(value);
        balances[event["arg1"]] = fromBalance.toString();
    }
    else {
        let fromBalance = new bignumber_js_1.default(balances[event["arg1"]] || 0);
        let toBalance = new bignumber_js_1.default(balances[event["arg2"]] || 0);
        let value = new bignumber_js_1.default(event["arg3"] || 0);
        fromBalance = fromBalance.minus(value);
        toBalance = toBalance.plus(value);
        balances[event["arg1"]] = fromBalance.toString();
        balances[event["arg2"]] = toBalance.toString();
    }
    // To update a variable in database instance
    db["totalSupply"] = totalSupply.toString();
    db["balances"] = balances;
};
exports.TransferHandler = TransferHandler;
