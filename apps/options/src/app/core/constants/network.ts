import { isDev, NetworkIds } from "@fantohm/shared-web3";

export const desiredNetworkId = isDev ? NetworkIds.Goerli : NetworkIds.Ethereum;
export const BINARY_ADDRESSES = {
  [NetworkIds.Goerli]: {
    MARKET_MANAGER_ADDRESS: "0xa05bBD029081D74d753b11FE824e6736Fc970E12",
    MARKET_VAULT_ADDRESS: "0xF89F92c4Ff4344662c34319c0Cdf36F237F02E55",
    DAI_ADDRESS: "0x5Ad048cf68111b81780b0284582C99Cd581ede9e",
  },
  [NetworkIds.Ethereum]: {
    MARKET_MANAGER_ADDRESS: "",
    MARKET_VAULT_ADDRESS: "",
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
};
