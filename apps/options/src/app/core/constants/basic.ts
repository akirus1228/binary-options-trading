import { currencyInfo, CurrencyInfo } from "@fantohm/shared-web3";
import { weeksToDays, hoursToMinutes } from "date-fns";
import { CryptoCurrency } from "../types/types";
import { NavItemProp } from "../types/types";

export const baseServerUrl = "http://localhost:3000/api";
export const socketURL = "http://localhost:3000";

export const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 1560, min: 1280 },
    items: 3,
  },
  laptopL: {
    breakpoint: { max: 1280, min: 1024 },
    items: 2,
    paritialVisibilityGutter: 50,
  },
  laptop: {
    breakpoint: { max: 860, min: 768 },
    items: 1,
    paritialVisibilityGutter: 180,
  },
  table: {
    breakpoint: { max: 768, min: 425 },
    items: 1,
    paritialVisibilityGutter: 100,
  },
  mobileL: {
    breakpoint: { max: 425, min: 375 },
    items: 1,
    paritialVisibilityGutter: 30,
  },
  mobileM: {
    breakpoint: { max: 375, min: 320 },
    items: 1,
    paritialVisibilityGutter: 15,
  },
  mobile: {
    breakpoint: { max: 320, min: 0 },
    items: 1,
  },
};

export const NavItems: NavItemProp[] = [
  { title: "Trade", href: "/trade" },
  { title: "Markets", href: "/markets" },
  { title: "Leaderboard", href: "/leaderboard" },
  { title: "Pools", href: "/pools" },
];

export const BettingCryptoCurrencies: CryptoCurrency[] = [
  { name: "Ether", symbol: "ETH" },
  { name: "Shiba", symbol: "SHIB" },
  { name: "Bitcoin", symbol: "WBTC" },
  { name: "Solana", symbol: "SOL" },
];

export const UnderlyingAssets: CurrencyInfo = {
  DAI: currencyInfo["DAI_ADDRESS"],
};

export const CommunityTools: NavItemProp[] = [
  { title: "Discord", href: "" },
  { title: "Twitter", href: "" },
  { title: "Report & problem", href: "" },
];

export const fee = 1;
export const double = 2;

export enum TimeframeEnum {
  ONE = 1,
  FIVE = 5,
  FIFTEEN = 15,
}

export const tabs = ["All", "Open", "Win", "Loss", "Draw"];

export const tradingInternalDate = {
  "5m": 5,
  "30m": 30,
  "1H": hoursToMinutes(1),
  "4H": hoursToMinutes(4),
};

export const tradingRageDate = {
  "1D": hoursToMinutes(24),
  "1W": weeksToDays(1) * hoursToMinutes(24),
  "1M": 1,
  "3M": 3,
  "6M": 6,
  YTD: "YTD",
  "12M": 12,
  "60M": 60,
  ALL: "ALL",
};
