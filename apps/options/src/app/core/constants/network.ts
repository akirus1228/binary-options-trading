import { isDev, NetworkIds } from "@fantohm/shared-web3";

export const desiredNetworkId = isDev ? NetworkIds.Goerli : NetworkIds.Ethereum;
export const BINARY_ADDRESSES = {
  [NetworkIds.Goerli]: {
    MARKET_MANAGER_ADDRESS: "0x2a0f5C3b3F5E8732eeDdB1E2D92dBe8FAEcb00aA",
    MARKET_VAULT_ADDRESS: "0x837fc1E2aAd3800193b6FcFb8f6231d37d0ACF15",
    DAI_ADDRESS: "0x5Ad048cf68111b81780b0284582C99Cd581ede9e",
  },
  [NetworkIds.Ethereum]: {
    MARKET_MANAGER_ADDRESS: "",
    MARKET_VAULT_ADDRESS: "",
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
};
