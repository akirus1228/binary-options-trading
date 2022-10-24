import { SvgIcon } from "@mui/material";
import HighArrowIcon from "@mui/icons-material/CallMade";

import { TradingPadProps } from "./trading-pad";

const TradingMarket = (props: TradingPadProps) => {
  return (
    <div className="trending-markets-pad text-lightgray">
      <div className="pads-body grid grid-rows-1 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 px-20 bg-woodsmoke py-15 rounded-2xl xs:my-10 md:my-20">
        <div className="pair col-span-2">
          <div className="flex">
            <div className="token-logo flex justify-center items-center xs:w-30 sm:w-50">
              <img
                src={`./assets/images/${props.underlyingToken.symbol}.png`}
                alt={`${props.underlyingToken.symbol} logo`}
              />
            </div>
            <div className="px-10">
              <p className="betting-token xs:text-15 sm:text-20 text-primary">
                {props.underlyingToken.name}
              </p>
              <p className="token-pair xs:text-10 sm:text-16 text-second">
                {props.sourceToken}/{props.underlyingToken.symbol}
              </p>
            </div>
          </div>
        </div>
        <div className="price xs:text-15 sm:text-20 text-primary flex items-center">
          $1,270.97
        </div>
        <div className="24h-change text-20 text-success xs:hidden sm:block">
          <div className="h-full flex items-center">
            <SvgIcon className="text-18 mr-5" component={HighArrowIcon} />
            <p>2.38%</p>
          </div>
        </div>
        <div className="24h-vol text-20 text-primary xs:hidden md:block ">
          <p className="h-full flex items-center">$7.2m</p>
        </div>
        <div className="24h-chat col-span-2 items-center  xs:hidden lg:block">
          <img src="./assets/images/trading0.png" alt="ETH logo" />
        </div>
        <div className="action xs:hidden sm:block">
          <div className="btn-trade h-full flex items-center ">
            <button className="px-35 py-10 text-16 text-woodsmoke bg-success rounded-xl">
              Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingMarket;
