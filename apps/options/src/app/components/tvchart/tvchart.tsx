import { useEffect } from "react";

import Datafeed from "./api";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export const TVChartContainer = () => {
  const configOptions = {
    symbol: "Coinbase:BTC/USD",
    interval: "15",
    containerId: "tv_chart_container",
    libraryPath: "tradingview_library/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  useEffect(() => {
    const widgetOptions = {
      debug: false,
      symbol: configOptions.symbol,
      datafeed: Datafeed,
      interval: configOptions.interval,
      container_id: configOptions.containerId,
      library_path: configOptions.libraryPath,
      locale: getLanguageFromURL() || "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: configOptions.chartsStorageUrl,
      charts_storage_api_version: configOptions.chartsStorageApiVersion,
      client_id: configOptions.clientId,
      user_id: configOptions.userId,
      fullscreen: configOptions.fullscreen,
      autosize: configOptions.autosize,
      studies_overrides: configOptions.studiesOverrides,
      overrides: {
        "mainSeriesProperties.showCountdown": true,
        "paneProperties.background": "#131722",
        "paneProperties.vertGridProperties.color": "#363c4e",
        "paneProperties.horzGridProperties.color": "#363c4e",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#AAA",
        "mainSeriesProperties.candleStyle.wickUpColor": "#336854",
        "mainSeriesProperties.candleStyle.wickDownColor": "#7f323f",
      },
    };
    window.TradingView.onready(() => {
      const widget = (window.tvWidget = new window.TradingView.widget(widgetOptions));

      widget.onChartReady(() => {
        console.log("Chart has loaded!");
      });
    });
  }, []);
  return <div id={configOptions.containerId} className={"TVChartContainer"} />;
};
