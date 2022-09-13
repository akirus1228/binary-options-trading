import { Web3ContextProvider } from "@fantohm/shared-web3";
import { useLayoutEffect } from "react";
import { Provider } from "react-redux";
// eslint-disable-next-line node/no-extraneous-import
import { useLocation } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app";
import store from "./store";

const ScrollToTop = (props: any) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.body.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  return null;
};

const Root = (): JSX.Element => {
  return (
    <Web3ContextProvider>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </Provider>
    </Web3ContextProvider>
  );
};

export default Root;
