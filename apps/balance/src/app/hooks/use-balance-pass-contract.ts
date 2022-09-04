import { allBonds, Bond, isDev, passNFTAbi, useWeb3Context } from "@fantohm/shared-web3";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo } from "react";

type UseBpGetTimestampsQueryResut = {
  whitelist1Timestamp: number;
  whitelist2Timestamp: number;
  publicTimestamp: number;
};
type UseBpPromiseResut = [BigNumber, BigNumber, BigNumber];

export const useBpGetTimestampsQuery =
  (): UseQueryResult<UseBpGetTimestampsQueryResut> => {
    const { address, provider } = useWeb3Context();
    const balancePassContract = useMemo(() => {
      return allBonds.find((bond: Bond) => bond.name === "passNFTmint") as Bond;
    }, []);

    useEffect(() => {
      console.log("address", address);
      console.log("provider", provider);
      console.log("balancePassContract", balancePassContract);
    }, [address, provider, balancePassContract]);

    return useQuery<UseBpGetTimestampsQueryResut>(
      ["bpTimestamps"],
      () => {
        console.log("started query");
        console.log("balancePassContract", balancePassContract);
        const contract = new ethers.Contract(
          balancePassContract.networkAddrs[isDev() ? 4 : 1].bondAddress,
          passNFTAbi,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          provider!
        );

        const wl1Timestamp: BigNumber = contract["whitelist1MintStartTimestamp"]();
        const wl2Timestamp: BigNumber = contract["whitelist2MintStartTimestamp"]();
        const publicTimestamp: BigNumber = contract["publicMintStartTimestamp"]();

        return Promise.all([wl1Timestamp, wl2Timestamp, publicTimestamp])
          .then((response: UseBpPromiseResut) => {
            return {
              whitelist1Timestamp: response[0].toNumber(),
              whitelist2Timestamp: response[1].toNumber(),
              publicTimestamp: response[2].toNumber(),
            } as UseBpGetTimestampsQueryResut;
          })
          .catch();
      },
      { enabled: !!balancePassContract && !!provider && !!address }
    );
  };
