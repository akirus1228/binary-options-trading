import { SvgIcon } from "@mui/material";
import {
  ErrorOutlineRounded,
  SettingsOutlined,
  LocalGasStationOutlined,
} from "@mui/icons-material";
import { currencyInfo, CurrencyDetails } from "@fantohm/shared-web3";
import { useState } from "react";

import { LabelIcon } from "../../../components/label-icon/label-icon";
import { CurrencyDropdown } from "../../../components/dropdown/currency-dropdown";
import { fee, double, UnderlyingAssets, TimeframeEnum } from "../../../core/constants";
import { TimeframeDropdown } from "../../../components/dropdown/timeframe-dropdown";

const TradingPad = () => {
  const [timeframe, setTimeFrame] = useState<TimeframeEnum>(TimeframeEnum.ONE);
  const [tokenAmount, setTokenAmount] = useState<number>(0.0);
  const [userBalance, setUserBalance] = useState<number>(0.0);
  const [selectedCurrency, setCurrency] = useState<CurrencyDetails>(
    currencyInfo["DAI_ADDRESS"]
  );

  const handleSetting = () => {
    console.log("click handleSetting");
  };
  const handleUp = () => {
    console.log("click handleSetting");
  };
  const handleDown = () => {
    console.log("click handleSetting");
  };

  return (
    <div className="w-full bg-woodsmoke rounded-3xl xs:px-10 xs:py-30 sm:px-35 md:px-15 lg:px-35  text-second">
      <div className="trade-header flex justify-between items-center text-22 text-primary mb-25">
        <p>Trade</p>
        <SvgIcon component={SettingsOutlined} onClick={handleSetting} />
      </div>
      <div className="timeframe rounded-2xl bg-heavybunker px-20 py-10 mb-5">
        <p className="text-16 mb-10">Timeframe</p>
        <div>
          <TimeframeDropdown setTimeframe={setTimeFrame} timeframe={timeframe} />
        </div>
      </div>
      <div className="input rounded-2xl bg-heavybunker px-20 py-10 mb-5">
        <div className="token-enter flex justify-between items-center xs:mb-10 sm:mb-15">
          <input
            type="text"
            value={tokenAmount}
            onChange={(e: any) => setTokenAmount(e.target.value)}
            className="w-full outline-none bg-heavybunker text-26"
          />
          <div>
            <CurrencyDropdown
              setCurrency={setCurrency}
              selectedCurrency={selectedCurrency}
              currencies={UnderlyingAssets}
            />
          </div>
        </div>
        <div className="token-status text-16 flex justify-between items-center">
          <p>${tokenAmount}</p>
          <p>Balance: {userBalance}</p>
        </div>
      </div>
      <div className="odds rounded-2xl bg-heavybunker px-20 py-10 mb-5">
        <div className="flex justify-between items-center xs:mb-10 sm:mb-15">
          <p>Odds</p>
          <div>
            <CurrencyDropdown
              setCurrency={setCurrency}
              selectedCurrency={selectedCurrency}
              currencies={UnderlyingAssets}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p>1:1</p>
          <p>Payout:&nbsp;{tokenAmount * double}</p>
        </div>
      </div>
      <div className="gas flex justify-between items-center xs:px-10 sm:px-20 mb-5">
        <div className="flex items-center">
          <LabelIcon
            label="Platform fee:"
            icon={ErrorOutlineRounded}
            reverse
            backgroundColor="wooksmoke"
            labelColor="second"
            iconColor="second"
          />
          <p>&nbsp;{fee}%</p>
        </div>
        <div className="rounded-2xl p-10 bg-wooksmoke flex items-center">
          <LabelIcon
            label="Gas:"
            icon={LocalGasStationOutlined}
            reverse
            backgroundColor="wooksmoke"
            labelColor="second"
            iconColor="second"
          />
          <p>&nbsp;${(tokenAmount * fee) / 100}</p>
        </div>
      </div>
      <div className="action text-white text-center xs:text-20 sm:text-26">
        <div
          className="w-full bg-success rounded-2xl xs:py-10 sm:py-15 mb-5"
          onClick={handleUp}
        >
          UP
        </div>
        <div
          className="w-full bg-danger rounded-2xl xs:py-10 sm:py-15"
          onClick={handleDown}
        >
          DOWN
        </div>
      </div>
    </div>
  );
};

export default TradingPad;
