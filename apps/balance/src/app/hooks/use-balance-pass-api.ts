import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

const balancePassApiUrl = "http://localhost:5000";

export const useBPGetProof = (address: string): UseQueryResult => {
  return useQuery(
    ["proof"],
    () => {
      return axios
        .get(`${balancePassApiUrl}/proof/${address}/0`, {
          validateStatus: (status) => status < 500,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            return res.data;
          } else {
            return axios.get(`${balancePassApiUrl}/proof/${address}/1`, {
              validateStatus: (status) => status < 500,
            }).then((res) => res.data);
          }
        })
        .catch((error) => {
          console.warn(error.toJson());
        });
    },

    { enabled: !!address }
  );
};
