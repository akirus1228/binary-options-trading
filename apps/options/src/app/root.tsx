import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Web3ContextProvider } from "@fantohm/shared-web3";
import { Provider } from "react-redux";
import { useLocation } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { useLayoutEffect, useState } from "react";

import App from "./app";
import store from "./store";
import { GRAPH_URL } from "./core/constants/basic";

const ScrollToTop = (props: any) => {
  const [prevPath, setPrevPath] = useState("");
  const location = useLocation();
  useLayoutEffect(() => {
    const prevBaseRoute = prevPath.split("/")[1];
    const baseRoute = location.pathname.split("/")[1];
    if (
      prevBaseRoute !== baseRoute ||
      (baseRoute !== "my-account" && baseRoute !== "account")
    ) {
      document.body.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setPrevPath(location.pathname);
  }, [location]);

  return null;
};

const client = new ApolloClient({
  uri: GRAPH_URL,
  cache: new InMemoryCache(),
});

const Root = (): JSX.Element => {
  return (
    <Web3ContextProvider>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <ScrollToTop />
            <App />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    </Web3ContextProvider>
  );
};

export default Root;
