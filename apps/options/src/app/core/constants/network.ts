import { isDev, NetworkIds } from "@fantohm/shared-web3";

export const desiredNetworkId = isDev ? NetworkIds.Goerli : NetworkIds.Ethereum;
export const BINARY_ADDRESSES = {
  [NetworkIds.Goerli]: {
    MARKET_MANAGER_ADDRESS: "0x2a0f5C3b3F5E8732eeDdB1E2D92dBe8FAEcb00aA",
    MARKET_VAULT_ADDRESS: "0x837fc1E2aAd3800193b6FcFb8f6231d37d0ACF15",
  },
  [NetworkIds.Ethereum]: {
    MARKET_MANAGER_ADDRESS: "",
    MARKET_VAULT_ADDRESS: "",
  },
};
