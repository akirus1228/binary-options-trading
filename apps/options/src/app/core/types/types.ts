import { TimeframeEnum } from "../constants";

export type NavItemProp = {
  title: string;
  href: string;
};

export type CryptoCurrency = {
  name: string;
  symbol: string;
};

export interface TokenPair {
  name: string;
  icon: string;
}
export interface TransactionProps {
  tx: string;
  from: string;
  to: string;
  timestamp: string;
  tokenPair: TokenPair;
  data: any;
}
export interface HistoryProps {
  type: "Up" | "Down";
  Asset: string;
  quantity: number;
  payout: number | undefined;
  status: boolean;
  open: number;
  close: number | undefined;
  timestamp: Date;
  expiration: Date;
  timer: TimeframeEnum | undefined;
}
