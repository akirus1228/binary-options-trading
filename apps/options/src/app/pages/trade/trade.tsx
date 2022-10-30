//yarn add kaktana-react-lightweight-charts
import Chart from "kaktana-react-lightweight-charts";
import { useState } from "react";

import TradingViewChart from "./components/tradingview-chart";
import TradingHistory from "./components/trading-history";
import TradingPad from "./components/trading-pad";
import Chat from "../../components/chat/chat";

const Trade = () => {
  return (
    <div className="grow w-full bg-heavybunker px-70 py-55 grid grid-cols-3 gap-30">
      <div className="col-span-2">
        <TradingViewChart />
      </div>
      <div className="trade-pad">
        <TradingPad />
      </div>
      <div className="trading-history">
        <TradingHistory />
      </div>
      <div className="chat">
        <Chat />
      </div>
    </div>
  );
};

export default Trade;
