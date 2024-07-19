import { keccak256 } from "ethers";

export class G1Point {
  X: string;
  Y: string;

  constructor(key: any) {
    this.X = key.X.toHexString();
    this.Y = key.Y.toHexString();
  }

  toUint8Array(hexString: string): Uint8Array {
    if (hexString.startsWith("0x")) {
      hexString = hexString.slice(2);
    }
    if (hexString.length % 2 !== 0) {
      hexString = "0" + hexString;
    }
    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      byteArray[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
    }
    return byteArray;
  }

  getOperatorID(): string {
    const xBytes = this.toUint8Array(this.X);
    const yBytes = this.toUint8Array(this.Y);
    const combined = new Uint8Array(xBytes.length + yBytes.length);

    combined.set(xBytes);
    combined.set(yBytes, xBytes.length);

    const hash = keccak256(combined);

    return hash;
  }
}
