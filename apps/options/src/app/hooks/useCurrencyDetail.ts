import { BettingCryptoCurrencies } from "../core/constants/basic";
import { CryptoCurrency } from "../core/types/types";

export const useCurrencyDetail = (underlyingCurrency: string | null): CryptoCurrency => {
  if (underlyingCurrency == null) return BettingCryptoCurrencies[0];
  else {
    const underlyingToken = BettingCryptoCurrencies.filter((item) => {
      return item.symbol === underlyingCurrency?.toUpperCase();
    });
    return underlyingToken[0];
  }
};
