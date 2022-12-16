import { useQuery } from "@apollo/client";

import { tradeEventQuery } from "../core/apollo/query";

export const useTradeHistory = () => {
  return useQuery(tradeEventQuery);
};
