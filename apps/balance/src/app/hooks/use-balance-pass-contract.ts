import { allBonds, Bond, isDev, passNFTAbi, useWeb3Context } from "@fantohm/shared-web3";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo } from "react";

export const useBpGetTimestampsQuery = (): UseQueryResult<[number, number]> => {
  const { address, provider } = useWeb3Context();
  const balancePassContract = useMemo(() => {
    return allBonds.find((bond: Bond) => bond.name === "passNFTmint") as Bond;
  }, []);

  return useQuery<[number, number]>(
    ["bpTimestamps"],
    () => {
      console.log("started query");
      const contract = new ethers.Contract(
        balancePassContract.networkAddrs[isDev() ? 4 : 1].bondAddress,
        passNFTAbi,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider!
      );

      const wl1Timestamp: BigNumber = contract["whitelist1MintStartTimestamp"]();
      const wl2Timestamp: BigNumber = contract["whitelist2MintStartTimestamp"]();

      return Promise.all([wl1Timestamp, wl2Timestamp])
        .then((response: [BigNumber, BigNumber]) => {
          return response.map((num: BigNumber) => num.toNumber() * 1000) as [
            number,
            number
          ];
        })
        .catch();
    },
    { enabled: !!balancePassContract && !!provider && !!address }
  );
};
