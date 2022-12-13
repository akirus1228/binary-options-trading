import { SvgIcon, TextField } from "@mui/material";
import {
  ErrorOutlineRounded,
  SettingsOutlined,
  LocalGasStationOutlined,
} from "@mui/icons-material";
import {
  isDev,
  NetworkIds,
  useWeb3Context,
  currencyInfo,
  CurrencyDetails,
  useErc20Balance,
} from "@fantohm/shared-web3";
import { ethers, Contract } from "ethers";
import { useSelector } from "react-redux";
import { useState, useMemo, MouseEvent, useEffect } from "react";

import { LabelIcon } from "../../../components/label-icon/label-icon";
import { CurrencyDropdown } from "../../../components/dropdown/currency-dropdown";
import { TimeframeDropdown } from "../../../components/dropdown/timeframe-dropdown";
import ConfirmTradePopup from "../../../components/pop-up/confirm-trade";
import { financialFormatter } from "../../../helpers/data-translations";
import { UnderlyingAssets } from "../../../core/constants/basic";
import { timeframes } from "../../../core/constants/tradingview";
import { Platform_Fee, RewardAmount_Percent } from "../../../core/constants/marketing";
import { BINARY_ADDRESSES, desiredNetworkId } from "../../../core/constants/network";
import { RootState } from "../../../store";
import { MarketManagerData } from "../../../store/reducers/markets-slice";
import BinaryMarketABI from "../../../core/abi/BinaryMarketABI.json";

const TradingPad = () => {
  const { connect, address, connected, chainId, provider } = useWeb3Context();

  const markets: MarketManagerData = useSelector((state: RootState) => state.markets);
  const [timeframe, setTimeFrame] = useState(timeframes[0]);
  const [tokenAmount, setTokenAmount] = useState<string>("0");
  const [direction, setDirection] = useState<"Up" | "Down">("Up");
  const [currency, setCurrency] = useState<CurrencyDetails>(currencyInfo["DAI_ADDRESS"]);
  const [isOpen, setOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(true);
  const [marketContract, setMarketContract] = useState<Contract>();

  const { balance: currencyBalance } = useErc20Balance(
    BINARY_ADDRESSES[desiredNetworkId].DAI_ADDRESS,
    address
  );

  useEffect(() => {
    console.log(markets);
    if (markets.isLoading === "ready" && provider) {
      const targetMarket = markets.markets[0];
      const targetMarketContract = new ethers.Contract(
        targetMarket.market,
        BinaryMarketABI,
        provider.getSigner()
      );
      setMarketContract(targetMarketContract);
    }
  }, [provider, chainId, address, markets.isLoading]);

  const isWalletConnected = useMemo(() => {
    return address && connected && chainId === desiredNetworkId;
  }, [address, connected, chainId]);

  const hasBalance = useMemo(() => {
    if (!currencyBalance) return false;
    return ethers.utils.parseUnits(tokenAmount || "0", 18).lte(currencyBalance);
  }, [address, chainId, currencyBalance, tokenAmount]);

  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    try {
      connect(true, isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);
    } catch (e: unknown) {
      console.warn(e);
    }
  };

  const handleSetting = () => {
    //TODO: handleSetting
  };

  const handleBetting = async (bettingDirection: "Up" | "Down") => {
    setDirection(bettingDirection);
    console.log("direction: ", direction);
    if (localStorage.getItem("hide") === "true") setOpen(true);
    else {
      console.log("asdf");
      if (marketContract) {
        console.log("marketContract: ", marketContract);
        await marketContract["openPosition"](
          ethers.utils.parseEther(tokenAmount),
          0,
          direction === "Up" ? "0" : "1"
        );
      }
    }
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(false);
  };

  useEffect(() => {
    const modalStorage = localStorage.getItem("hide");
    if (modalStorage && JSON.parse(modalStorage) === true) {
      setShowConfirmDialog(false);
    } else setShowConfirmDialog(true);
  }, [isOpen]);

  return (
    <>
      <div className="w-full bg-woodsmoke rounded-3xl xs:px-10 sm:px-35 md:px-15 lg:px-35 xs:py-10 sm:py-20 md:py-30 text-second max-w-500">
        <div className="trade-header flex justify-between items-center text-22 text-primary mb-25">
          <p>Trade</p>
          <SvgIcon
            component={SettingsOutlined}
            onClick={handleSetting}
            className="hidden"
          />
        </div>
        <div className="timeframe rounded-2xl bg-heavybunker px-20 py-10 mb-5">
          <p className="text-16 mb-10">Timeframe</p>
          <div>
            <TimeframeDropdown setTimeframe={setTimeFrame} timeframe={timeframe} />
          </div>
        </div>
        <div className="input rounded-2xl bg-heavybunker px-20 py-10 mb-5">
          <div className="token-enter flex justify-between items-center xs:mb-10 sm:mb-15">
            <TextField
              variant="standard"
              type="number"
              InputProps={{
                disableUnderline: true,
                style: {
                  flexGrow: 1,
                  fontSize: "26px",
                  margin: "0px",
                },
              }}
              inputProps={{ style: { color: "#c1d6eb" } }}
              sx={{
                "& ::-webkit-inner-spin-button": {
                  margin: "0px",
                  appearance: "none",
                },
                "& ::-webkit-outer-spin-button": {
                  margin: "0px",
                  appearance: "none",
                },
              }}
              value={tokenAmount}
              focused
              onChange={(e) => setTokenAmount(e.target.value || "0")}
            />
            <div>
              <CurrencyDropdown
                setCurrency={setCurrency}
                selectedCurrency={currency}
                currencies={UnderlyingAssets}
              />
            </div>
          </div>
          <div className="token-status text-16 flex justify-between items-center">
            <p>{financialFormatter.format(parseFloat(tokenAmount))}</p>
            <p>
              Balance:{" "}
              {currencyBalance &&
                ethers.utils.formatUnits(currencyBalance, currency?.decimals ?? 18)}
            </p>
          </div>
        </div>
        <div className="odds rounded-2xl bg-heavybunker px-20 py-10 mb-5">
          <div className="flex justify-between items-center xs:mb-10 sm:mb-15">
            <p>Odds</p>
            <div>
              <CurrencyDropdown
                setCurrency={setCurrency}
                selectedCurrency={currency}
                currencies={UnderlyingAssets}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p>1:1</p>
            <p>Payout:&nbsp;{parseFloat(tokenAmount) * RewardAmount_Percent}</p>
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
            <p>&nbsp;{Platform_Fee}%</p>
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
            <p>&nbsp;${(parseFloat(tokenAmount) * Platform_Fee) / 100}</p>
          </div>
        </div>
        {isWalletConnected ? (
          hasBalance ? (
            <div className="action text-white text-center xs:text-20 sm:text-26 cursor-default">
              <div
                className="w-full bg-success rounded-2xl xs:py-10 sm:py-15 mb-5"
                onClick={() => handleBetting("Up")}
              >
                UP
              </div>
              <div
                className="w-full bg-danger rounded-2xl xs:py-10 sm:py-15"
                onClick={() => handleBetting("Down")}
              >
                DOWN
              </div>
            </div>
          ) : (
            <div className="w-full bg-second text-primary text-center rounded-2xl xs:py-10 sm:py-15 cursor-not-allowed xs:text-18 sm:text-24">
              Insufficient balance
            </div>
          )
        ) : (
          <button
            className="w-full bg-success rounded-2xl xs:py-10 sm:py-15 text-white text-center xs:text-20 sm:text-26"
            onClick={onClickConnect}
          >
            Connect
          </button>
        )}
      </div>
      <ConfirmTradePopup
        interval={timeframe}
        currencyValue={Number(tokenAmount)}
        selectedCurrency={currency}
        direction={direction}
        open={isOpen && showConfirmDialog}
        onClose={(value: boolean) => handleClose(value)}
      />
    </>
  );
};

export default TradingPad;
