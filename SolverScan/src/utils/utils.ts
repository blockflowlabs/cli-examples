export const COW_PROTOCOL_TOPIC0 =
  "0xa07a543ab8a018198e99ca0184c93fe9050a79400a0a723441f84de1d972cc17";
export const COW_PROTOCOL_ADDRESS =
  "0x9008D19f58AAbD9eD0D60971565AA8510560ab41";
export const SETTLEMENT_LOG_TOPIC =
  "0x40338ce1a7c49204f0099533b1e9a7ee0a3d261f84974ab7af36105b8c4e9db4";

export function pairIdgenerator(str1: string, str2: string): string {
  if (str1 > str2) {
    return str1 + str2;
  } else {
    return str2 + str1;
  }
}
