import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

const balancePassApiUrl = "http://localhost:5000";

type ProofResponse = {
  wl: number;
  proof: string[];
};

export const useBPGetProof = (address: string): UseQueryResult<ProofResponse> => {
  return useQuery<ProofResponse>(
    ["proof"],
    () => {
      return axios
        .get(`${balancePassApiUrl}/proof/${address}`, {
          validateStatus: (status) => status < 500,
        })
        .then((res: AxiosResponse) => {
          if (res.status === 200) {
            return res.data.json;
          }
        })
        .catch((err) => console.warn(err));
    },

    { enabled: !!address }
  );
};
