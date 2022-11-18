import Logo from "../../components/logo/logo";
import TradingMarket from "../../components/trading/trading-market";
import { BettingCryptoCurrencies } from "../../core/constants/basic";
import { CryptoCurrency } from "../../core/types/types";

export const Markets = (): JSX.Element => {
  return (
    <>
      <div className="xs:px-5 sm:px-40 md:px-90 xs:pt-50 sm:py-50 bg-heavybunker grow cursor-default flex flex-col">
        <div className="title xs:flex flex-col items-center sm:block xs:px-20 sm:px-40 py-20 xs:mt-10 xs:mb-40 sm:my-10 sm:mb-50 bg-cover sm:bg-[url('./assets/images/bg-market-sm.png')] lg:bg-[url('./assets/images/bg-market-lg.png')] bg-no-repeat  rounded-2xl">
          <p className="xs:text-35 sm:text-40 text-primary">Markets</p>
          <p className="xs:text-16 sm:text-22 text-second">Top payouts of all time</p>
        </div>
        <div className="grow trending-markets flex flex-col">
          <div className="pads-title grid grid-rows-1 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 px-20 xs:text-15 sm:text-20 text-lightgray">
            <div className="col-span-2">Pair</div>
            <div className="">Price</div>
            <div className="xs:hidden sm:block">24h Change</div>
            <div className="xs:hidden md:block">24h Vol.</div>
            <div className="col-span-2 xs:hidden lg:block">24h Chart</div>
            <div className="xs:hidden sm:block"></div>
          </div>
          <div className="">
            {BettingCryptoCurrencies.map((item: CryptoCurrency) => {
              return (
                <TradingMarket
                  sourceToken="DAI"
                  underlyingToken={item}
                  key={item.symbol}
                />
              );
            })}
          </div>
        </div>
      </div>
      <footer className="xs:block sm:hidden bg-bunker xs:h-60 sm:h-90 w-full fixed bottom-0 right-0">
        <div className="h-full flex justify-center items-center xs:w-full md:w-1/3">
          <Logo dark />
        </div>
      </footer>
    </>
  );
};

export default Markets;
