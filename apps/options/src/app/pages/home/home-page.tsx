import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { SvgIcon } from "@mui/material";
import { Report, Twitter } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../components/logo/logo";
import TrendingPad from "../../components/trending/trending-pad";
import TrendingMarket from "../../components/trending/trending-market";
import TradingExperience from "../../components/trading-experience/trading-experience";
import DemoAccount from "../../components/demo-account/demo-account";
import TradingCommunity from "../../components/trading-community/trading-community";
import Discord from "../../../assets/icons/discord.svg";
import { CryptoCurrency, NavItemProp } from "../../core/types/types";
import {
  BettingCryptoCurrencies,
  NavItems,
  responsive,
} from "../../core/constants/basic";
import { DiscordURL, ReportURL, TwitterURL } from "../../core/constants/social_url";

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const handleTradeClick = () => {
    navigate("/trade?underlyingToken=eth");
  };
  return (
    <div className="bg-heavybunker xs:pt-70 md:pt-90 xs:bg-contain xs:bg-[url('./assets/images/xs-bg-img.jpg')] sm:bg-[url('./assets/images/bg-img-lg.png')] bg-no-repeat">
      <div className="landing-page">
        <div className="w-full xs:px-10 sm:px-30 md:px-70 pt-150">
          <div className="xs:w-270 sm:w-530 flex flex-col">
            <p className="text-success xs:text-14 md:text-16 font-OcrExtendedRegular xs:mb-5 sm:mb-10">
              CRYPTO BINARY OPTIONS
            </p>
            <div className="text-primary text-26 sm:text-32 md:text-43 lg:text-52 xl:text-55 xs:mb-10 sm:mb-30 leading-tight">
              <p>Trade crypto binary</p>
              <p>options on-chain</p>
            </div>
            <div className="flex justify-start items-center font-OcrExtendedRegular">
              <button
                className="xs:py-10 xs:px-30 sm:py-15 sm:px-60 text-18 text-woodsmoke bg-success rounded-xl mr-20  uppercase"
                onClick={handleTradeClick}
              >
                Trade
              </button>
              <button className="xs:py-10 xs:px-30 sm:py-15 sm:px-60 text-18 text-white border border-success bg-aztec rounded-xl  uppercase">
                Demo
              </button>
            </div>
          </div>
          <Carousel
            className="xs:pt-50 md:pt-80 xl:pt-120"
            partialVisible={true}
            responsive={responsive}
            arrows={false}
          >
            {BettingCryptoCurrencies.map((item: CryptoCurrency) => {
              return (
                <TrendingPad sourceToken="DAI" underlyingToken={item} key={item.symbol} />
              );
            })}
          </Carousel>
        </div>
      </div>
      <div className="trending-markets xs:px-10 sm:px-30 md:px-70 xs:pt-50 md:pt-80 xl:pt-120">
        <p className="trending-markets-title xs:text-30 sm:text-40 text-primary mb-30">
          Trending markets
        </p>
        <div className="pads-title grid grid-rows-1 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 px-20 xs:text-15 sm:text-20 text-lightgray">
          <div className="col-span-2">Pair</div>
          <div className="">Price</div>
          <div className="xs:hidden sm:block">24h Change</div>
          <div className="xs:hidden md:block">24h Vol.</div>
          <div className="col-span-2 xs:hidden lg:block">24h Chart</div>
          <div className="xs:hidden sm:block"></div>
        </div>
        {BettingCryptoCurrencies.map((item: CryptoCurrency) => {
          return (
            <TrendingMarket sourceToken="DAI" underlyingToken={item} key={item.symbol} />
          );
        })}
      </div>
      <div className="xs:px-10 sm:px-30 md:px-70">
        <TradingExperience />
      </div>
      <div className="grid xs:grid-rows-2 lg:grid-rows-1 xs:grid-cols-1 lg:grid-cols-2 xs:gap-0 lg:gap-80 xs:px-10 sm:px-30 md:px-70">
        <TradingCommunity />
        <DemoAccount />
      </div>
      <div className="xs:hidden md:flex  flex-col justify-center items-center py-90 text-second text-16">
        <p>
          Hi-Lo is a{" "}
          <a
            href="http://balance.capital"
            target={"_blank"}
            rel="noreferrer"
            className="underline"
          >
            balance.capital
          </a>{" "}
          product.
        </p>
        <p>
          *Trading binary options carries substantial financial and other risks. Hi-Lo
          does not provide financial advice.
        </p>
      </div>
      <footer className="bg-bunker h-90 flex justify-between items-center md:px-40 lg:px-60 text-second text-18 xs:mt-90 md:mt-0 cursor-default">
        <div className="xs:hidden lg:flex menu md:w-1/3 justify-between items-center">
          {NavItems.map((item: NavItemProp) => {
            return (
              <Link key={item.title} to={item.href}>
                {item.title}
              </Link>
            );
          })}
        </div>
        <div className="h-full flex justify-center items-center xs:w-full lg:w-1/3">
          <Logo dark />
        </div>
        <div className="xs:hidden lg:flex community-tool lg:w-1/3 justify-around items-center">
          <div className="flex items-center">
            <SvgIcon
              component={() => (
                <img
                  src={Discord}
                  width={25}
                  alt="Discord logo"
                  className="text-second mr-10"
                />
              )}
            />
            <a
              href={DiscordURL}
              target="_blank"
              className="cursor-default"
              rel="noreferrer"
            >
              Discord
            </a>
          </div>
          <div className="flex items-center">
            <SvgIcon component={Twitter} sx={{ width: "30px", marginRight: "5px" }} />
            <a
              href={TwitterURL}
              target="_blank"
              className="cursor-default"
              rel="noreferrer"
            >
              Twitter
            </a>
          </div>
          <div className="flex items-center">
            <SvgIcon component={Report} sx={{ width: "30px", marginRight: "5px" }} />
            <a
              href={ReportURL}
              target="_blank"
              className="cursor-default"
              rel="noreferrer"
            >
              Report
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
