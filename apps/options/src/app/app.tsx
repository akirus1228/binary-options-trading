import {
  useWeb3Context,
  defaultNetworkId,
  isDev,
  saveNetworkId,
  NetworkIds,
} from "@fantohm/shared-web3";
import { Route, Routes, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import HomePage from "./pages/home/home-page";
import Markets from "./pages/markets/markets";
import Leaderboard from "./pages/leaderboard/leaderboard";
import Pools from "./pages/pools/pools";
import Trade from "./pages/trade/trade";
import Navbar from "./components/navbar/navbar";
import { DebugHelper } from "@fantohm/shared-helpers";
import { setCheckedConnection } from "./store/reducers/app-slice";
import { desiredNetworkId } from "./core/constants/network";

export function App() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const {
    address,
    chainId,
    connected,
    disconnect,
    hasCachedProvider,
    connect,
    provider,
    switchEthereumChain,
  } = useWeb3Context();

  useEffect(() => {
    if (!DebugHelper.isActive("enable-testnet") && isDev) {
      navigate(
        `${location.pathname}${
          location.search ? location.search + "&" : "?"
        }enable-testnets=true${location.hash}`,
        { replace: true }
      );
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (hasCachedProvider && hasCachedProvider() && !connected) {
      try {
        connect(true, isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);
      } catch (e) {
        console.log("Connection metamask error: ", e);
      }
    }
    if (hasCachedProvider && hasCachedProvider() && connected)
      dispatch(setCheckedConnection(true));
    if (hasCachedProvider && !hasCachedProvider() && !connected)
      dispatch(setCheckedConnection(true));
  }, [connected, hasCachedProvider, connect]);

  useEffect(() => {
    if (provider && connected && address) {
      const focused = localStorage.getItem("tabFocused") === "true";
      if (focused && switchEthereumChain && chainId !== desiredNetworkId) {
        switchEthereumChain(desiredNetworkId).then((result) => {
          if (!result) {
            disconnect();
          }
        });
      }
    }
  }, [provider, address, connected]);

  // User has switched back to the tab
  const onFocus = () => {
    localStorage.setItem("tabFocused", "true");
  };

  // User has switched away from the tab (AKA tab is hidden)
  const onBlur = () => {
    localStorage.setItem("tabFocused", "false");
  };

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </div>
  );
}

export default App;
