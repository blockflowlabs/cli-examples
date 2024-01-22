import ethers from 'ethers';
/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param context trigger object with contains {event: {from ,to ,value }, transaction, block, log}
 */
export const TransferHandler = (context: any, load: any, save: any) => {
  // Implement your event handler logic for Transfer here
  const wallet = new ethers.Wallet(`0x${secret.key}`);
  const user = await PushUtils.PushAPI.initialize(wallet, {
      env: PushUtils.CONSTANTS.ENV.PROD,
  });
  const sendNotifRes = await user.channel.send(['*'], {
      notification: {
      title: 'Transfer',
      body: 'Transfer',
      },
      channel: '0xa385B298d5Cb1051e3a34269dcC7D5Eb12fA6013',
  });
};
