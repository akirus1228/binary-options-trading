import TradingViewChart from "./components/tradingview-chart";
import TradingHistory from "./components/trading-history";
import TradingPad from "./components/trading-pad";
import Chat from "../../components/chat/chat";

const Trade = () => {
  return (
    <div className="grow w-full bg-heavybunker xs:px-10 sm:px-20 md:px-40 lg:px-70 xs:py-20 md:py-55 grid xs:grid-cols-1 md:grid-cols-5 xs:gap-10 md:gap-30">
      <div className="md:col-span-3">
        <TradingViewChart />
      </div>
      <div className="trade-pad md:col-span-2">
        <TradingPad />
      </div>
      <div className="trading-history md:col-span-3">
        <TradingHistory />
      </div>
      <div className="chat md:col-span-2">
        <Chat />
      </div>
    </div>
  );
};

export default Trade;
