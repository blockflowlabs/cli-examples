export function getChainId(network: string): string | null {
  switch (network.toLowerCase()) {
    case "ethereum":
      return "1";
    case "linea":
      return "59144";
    case "optimism":
      return "10";
    case "avalanche":
      return "43114";
    case "polygon":
      return "137";
    default:
      return null;
  }
}

export function hexToString(hex: string) {
  // Remove the "0x" prefix if present
  hex = hex.replace(/^0x/, "");

  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.slice(i, i + 2), 16);
    if (code !== 0) {
      str += String.fromCharCode(code);
    }
  }
  return str;
}
