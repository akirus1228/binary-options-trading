import { enabledNetworkIds, networks } from "./networks";

export const THE_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/colonelssecretspices/kfc-graph";

export const TOKEN_DECIMALS = 9;

export const MISSING_ADDRESS = "0x0000000000000000000000000000000000000000";

export const UAUTH_CLIENT_ID = "dbdd65ab-0c1e-46ad-be65-8a6adb3dd4d5";

export const DEV_UD_REDIRECT_URI = "http://localhost:4200";

export const PROD_UD_REDIRECT_URI = "https://beta.liqdnft.com";

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = enabledNetworkIds.reduce(
  (addresses: { [key: number]: { [key: string]: string } }, networkId) => (
    (addresses[networkId] = networks[networkId].addresses), addresses
  ),
  {}
);
