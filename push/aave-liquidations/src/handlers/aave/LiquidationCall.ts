import ethers from 'ethers';

/**
 * @dev Event::LiquidationCall(address collateralAsset, address debtAsset, address user, uint256 debtToCover, uint256 liquidatedCollateralAmount, address liquidator, bool receiveAToken)
 * @param context trigger object with contains {event: {collateralAsset ,debtAsset ,user ,debtToCover ,liquidatedCollateralAmount ,liquidator ,receiveAToken }, transaction, block, log}
 */
export const LiquidationCallHandler = async (context: any, load: any, save: any) => {
  // Implement your event handler logic for LiquidationCall here
  const wallet = new ethers.Wallet(`0x${secret.key}`);
    const user = await PushUtils.PushAPI.initialize(wallet, {
        env: PushUtils.CONSTANTS.ENV.PROD,
    });
    const sendNotifRes = await user.channel.send([`${context.event.user}`], {
        notification: {
        title: 'Liquidation',
        body: 'You got Liquidated :(',
        },
        channel: '0xa385B298d5Cb1051e3a34269dcC7D5Eb12fA6013',
    });
};
