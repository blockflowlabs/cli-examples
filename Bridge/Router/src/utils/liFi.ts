import axios from "axios";

export const getNativeAddress = (chainId: string) =>
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export async function fetchLifiFeeTimeData({
  fromChainId,
  fromAmount,
  fromTokenAddress,
  toChainId,
  toTokenAddress,
}: {
  fromChainId: string;
  fromAmount: string;
  fromTokenAddress: string;
  toChainId: string;
  toTokenAddress: string;
}) {
  const url = "https://li.quest/v1/advanced/routes";
  const payload = JSON.stringify({
    fromChainId: fromChainId,
    fromAmount: fromAmount,
    fromTokenAddress:
      fromTokenAddress.toLowerCase() ===
      getNativeAddress(fromChainId).toLowerCase()
        ? "0x0000000000000000000000000000000000000000"
        : fromTokenAddress,
    toChainId: toChainId,
    toTokenAddress:
      toTokenAddress.toLowerCase() === getNativeAddress(toChainId).toLowerCase()
        ? "0x0000000000000000000000000000000000000000"
        : toTokenAddress,
    options: {
      order: "CHEAPEST",
    },
  });

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    let bridgeTime = 0,
      bridgeFees = 0,
      gasFeesUsd = 0;
    // Handle the API response data here
    //console.log(response.data);
    for (var i = 0; i < response.data.routes.length; i++) {
      let recoRouteAgg = response.data.routes[i];
      gasFeesUsd += parseFloat(recoRouteAgg.gasCostUSD);
      for (var k = 0; k < recoRouteAgg.steps[0].includedSteps.length; k++) {
        if (recoRouteAgg.steps[0].includedSteps[k].type == "cross") {
          var bridge = recoRouteAgg.steps[0].includedSteps[k];
          var feeCosts = bridge.estimate.feeCosts;
          bridgeTime += parseFloat(bridge.estimate.executionDuration);
          for (var j = 0; j < feeCosts.length; j++) {
            bridgeFees += parseFloat(feeCosts[j].amountUSD);
          }
        }
      }
    }
    return {
      gasFeeUsd: gasFeesUsd / response.data.routes.length,
      bridgeFeeUsd: bridgeFees / response.data.routes.length,
      timeTaken: bridgeTime / response.data.routes.length,
    };
  } catch (error) {
    // Handle errors
    //console.error("There was an error with the request:", error);
    return null;
  }
}
