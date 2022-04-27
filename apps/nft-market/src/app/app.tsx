import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { NftLight, NftDark } from "@fantohm/shared-ui-themes";
import {
  useWeb3Context,
  defaultNetworkId,
  loadWalletCurrencies,
  loadWalletAssets,
  loadListings,
  authorizeAccount,
} from "@fantohm/shared-web3";
import { Header, Footer } from "./components/template";
// import { Messages } from "./components/messages/messages";
import { HomePage } from "./pages/home/home-page";
import { RootState } from "./store";
import { ScrollToTop } from "@fantohm/shared/ui-helpers";
import BorrowPage from "./pages/borrow-page/borrow-page";
import LendPage from "./pages/lend-page/lend-page";
import MyAccountPage from "./pages/my-account-page/my-account-page";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  const themeType = useSelector((state: RootState) => state.theme.mode);
  const wallet = useSelector((state: RootState) => state.wallet);
  const backend = useSelector((state: RootState) => state.nftMarketplace);

  const [theme, setTheme] = useState(NftLight);
  const { address, chainId, connected, provider } = useWeb3Context();

  useEffect(() => {
    setTheme(themeType === "light" ? NftLight : NftDark);
  }, [themeType]);

  // Load assets and nfts in current wallet
  useEffect(() => {
    if (address) {
      console.log("app-chainId, address: ", chainId, address);
      dispatch(loadWalletCurrencies({ networkId: chainId || defaultNetworkId, address }));
      dispatch(loadWalletAssets({ networkId: chainId || defaultNetworkId, address }));
    }
  }, [chainId, address, dispatch]);

  // login to the backend api
  useEffect(() => {
    if (
      provider &&
      chainId &&
      connected &&
      wallet.status === "succeeded" &&
      ["unknown", "failed"].includes(backend.accountStatus) &&
      backend.authSignature === null
    ) {
      dispatch(
        authorizeAccount({ networkId: chainId || defaultNetworkId, address, provider })
      );
    }
  }, [provider, wallet.status, backend.accountStatus]);

  // load listings from backend api
  useEffect(() => {
    if (
      provider &&
      backend.accountStatus === "ready" &&
      backend.status === "idle" &&
      backend.authSignature
    ) {
      dispatch(
        loadListings({ networkId: chainId || defaultNetworkId, address, provider })
      );
    }
  }, [backend.authSignature]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box paddingTop={5} paddingBottom={12} sx={{ height: "100vh" }}>
        <ScrollToTop />
        {/* <Messages /> */}
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/borrow" element={<BorrowPage />} />
          <Route path="/lend" element={<LendPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <h1>404</h1>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
