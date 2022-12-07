import { SvgIcon } from "@mui/material";
import HighArrowIcon from "@mui/icons-material/CallMade";
import { useNavigate } from "react-router-dom";

import { TokenPair } from "../token-pair/token-pair";
import { TrendingPadProps } from "./trending-pad";
import { CryptoCurrency } from "../../core/types/types";

const TrendingMarket = (props: TrendingPadProps) => {
  const navigate = useNavigate();

  const handleTradeClick = (underlyingToken: CryptoCurrency) => {
    navigate(`/trade?underlyingToken=${underlyingToken.symbol.toLowerCase()}`);
  };
  return (
    <div className="trending-markets-pad text-lightgray">
      <div className="pads-body grid grid-rows-1 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 px-20 bg-woodsmoke py-15 rounded-2xl xs:my-10 md:my-20">
        <div className="pair col-span-2">
          <TokenPair
            underlyingToken={props.underlyingToken}
            basicToken={props.sourceToken}
          />
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
            <button
              className="px-35 py-10 text-16 text-woodsmoke bg-success rounded-xl"
              onClick={() => handleTradeClick(props.underlyingToken)}
            >
              Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingMarket;
