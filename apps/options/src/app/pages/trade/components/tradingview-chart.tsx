import { SvgIcon } from "@mui/material";
import { CallMade } from "@mui/icons-material";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useState } from "react";

import CountTimer from "../../../components/count-timer/count-timer";
import { BettingCurrencyDropdown } from "../../../components/dropdown/betting-currency";
import { SymbolDescription } from "../../../components/symbol-description/symbol-description";
import { DateRage } from "../../../components/date-rage/date-rage";
import { BettingCryptoCurrencies } from "../../../core/constants";
import { CryptoCurrency } from "../../../core/types/types";
import { financialFormatter } from "../../../helpers/data-translations";

const mockupData = {
  price: 1343,
  percentage: 2.38,
  date: "today",
};

const TradingViewChart = () => {
  const [selectedBettingCurrency, setCurrency] = useState<CryptoCurrency>(
    BettingCryptoCurrencies[0]
  );

  const copyright = document.querySelector(
    "#tradingview_widget_wrapper"
  )?.lastElementChild;
  console.log("copyright:", copyright);
  if (copyright != null) copyright.remove();

  return (
    <div className="w-full h-full flex flex-col relative">
      <BettingCurrencyDropdown
        bettingCurrencies={BettingCryptoCurrencies}
        selectedBettingCurrency={selectedBettingCurrency}
        setCurrency={setCurrency}
      />
      <div className="absolute bottom-30 right-1/2 z-10 translate-x-1/2">
        <CountTimer countdown={5 * 60 * 1000} />
      </div>
      <div className=" flex justify-between items-end">
        <div className="symbol-description flex items-end">
          <p className="price text-primary xs:text-30 lg:text-37 xs:mr-15 lg:mr-25">
            {financialFormatter.format(mockupData.price)}
          </p>
          <div className="percentage text-19 text-success mr-5 pb-5 flex items-center">
            <SvgIcon className="text-18 mr-5" component={CallMade} />
            <p>{mockupData.percentage}%</p>
          </div>
          <p className="date text-19 text-second pb-5">{mockupData.date}</p>
        </div>
        <DateRage />
      </div>
      <div className="min-h-300 grow relative">
        <div className="absolute top-0 left-80 z-10">
          <SymbolDescription
            underlyingToken={selectedBettingCurrency.name}
            basicToken="dai"
            dateRage="4H"
          />
        </div>
        <AdvancedRealTimeChart
          symbol="BINANCE:ETHUSD"
          locale="en"
          autosize
          hide_legend
          hide_top_toolbar
          enable_publishing={false}
          withdateranges={false}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default TradingViewChart;
