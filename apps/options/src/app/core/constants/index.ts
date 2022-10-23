import { CryptoCurrency } from "../types/types";
import { NavItemProp } from "../types/types";

export const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1600 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 1600, min: 1250 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1250, min: 900 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 900, min: 0 },
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
  { name: "Cosmos", symbol: "ATOM" },
  { name: "Polygon", symbol: "MATIC" },
];

export const CommunityTools: NavItemProp[] = [
  { title: "Discord", href: "" },
  { title: "Twitter", href: "" },
  { title: "Report & problem", href: "" },
];
