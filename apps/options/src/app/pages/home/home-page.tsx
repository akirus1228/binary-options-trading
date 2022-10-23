import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import TradingPad from "../../components/trading";
import { CryptoCurrency } from "../../core/types/types";
import { BettingCryptoCurrencies } from "../../core/constants/token-pair";

export const HomePage = (): JSX.Element => {
  const responsive = {
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

  return (
    <div className="bg-[url('./assets/images/bg-img.png')] bg-cover">
      <div className="h-screen w-full bg-black opacity-70 xs:px-30 sm:px-90 pt-150">
        <div className="xs:w-270 sm:w-500 flex flex-col with-520">
          <p className="text-success text-15 xs:mb-5 sm:mb-10">CRYPTO BINARY OPTIONS</p>
          <p className="text-primary xs:text-30 sm:text-55 xs:mb-10 sm:mb-30">
            Trade crypto binary options on-chain
          </p>
          <div className="flex justify-between items-center">
            <button className="xs:py-10 xs:px-30 sm:py-15 sm:px-60 text-18 text-woodsmoke bg-success rounded-xl">
              Trade
            </button>
            <button className="xs:py-10 xs:px-30 sm:py-15 sm:px-60 text-18 text-white bg-black border border-success rounded-xl">
              Demo
            </button>
          </div>
        </div>
        <Carousel className="pt-60" responsive={responsive}>
          {BettingCryptoCurrencies.map((item: CryptoCurrency) => {
            return <TradingPad sourceToken="DAI" underlyingToken={item} />;
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default HomePage;
