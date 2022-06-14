import { isDev, NetworkIds } from "@fantohm/shared-web3";

export const desiredNetworkId = isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum;
