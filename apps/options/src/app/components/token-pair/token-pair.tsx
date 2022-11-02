import { CryptoCurrency } from "../../core/types/types";

export const TokenPair = (tokenPair: {
  underlyingToken: CryptoCurrency;
  basicToken: string;
}) => {
  return (
    <div className="flex">
      <div className="token-logo flex justify-center items-center xs:w-30 sm:w-50">
        <img
          src={`./assets/images/${tokenPair.underlyingToken.symbol}.png`}
          alt={`${tokenPair.underlyingToken.symbol} logo`}
        />
      </div>
      <div className="px-10">
        <p className="betting-token xs:text-15 sm:text-20 text-primary">
          {tokenPair.underlyingToken.name}
        </p>
        <p className="token-pair xs:text-10 sm:text-16 text-second">
          {tokenPair.basicToken}/{tokenPair.underlyingToken.symbol}
        </p>
      </div>
    </div>
  );
};
