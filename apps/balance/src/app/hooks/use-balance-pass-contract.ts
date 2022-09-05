import { error, isDev, passNFTAbi, useWeb3Context } from "@fantohm/shared-web3";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { BigNumber, ContractReceipt, ContractTransaction, ethers } from "ethers";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

const bpContractAddress = isDev()
  ? "0x328b186Ba8beFccB2f7F85DC57084F2cd464fe1B"
  : "0x328b186Ba8beFccB2f7F85DC57084F2cd464fe1B";

type UseBpGetTimestampsQueryResut = {
  whitelist1Timestamp: number;
  whitelist2Timestamp: number;
  publicTimestamp: number;
};
type UseBpPromiseResut = [BigNumber, BigNumber, BigNumber];

type UseBpGetWalletBalanceQueryResut = {
  walletBalance: number;
};

export const useBpGetTimestampsQuery =
  (): UseQueryResult<UseBpGetTimestampsQueryResut> => {
    const { address, provider } = useWeb3Context();

    useEffect(() => {
      console.log("address", address);
      console.log("provider", provider);
      console.log("isDev", isDev());
      console.log("bpContractAddress", bpContractAddress);
    }, [address, provider]);

    return useQuery<UseBpGetTimestampsQueryResut>(
      ["bpTimestamps"],
      () => {
        console.log("starting timestamp query");
        const contract = new ethers.Contract(
          bpContractAddress,
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
      { enabled: !!provider && !!address }
    );
  };

export const useBpGetWalletBalanceQuery = (): UseQueryResult<number> => {
  const { address, provider } = useWeb3Context();

  return useQuery(
    ["bpGetWalletBalance"],
    () => {
      const contract = new ethers.Contract(
        bpContractAddress,
        passNFTAbi,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider!
      );

      const walletBalance: number = contract["balanceOf"](address).then(
        (balance: BigNumber) => balance.toNumber()
      );

      return walletBalance;
    },
    { enabled: !!provider && !!address }
  );
};

export const useBpGetTotalSupplyQuery = (): UseQueryResult<number> => {
  const { address, provider } = useWeb3Context();

  return useQuery(
    ["bpGetTotalSupply"],
    () => {
      const contract = new ethers.Contract(
        bpContractAddress,
        passNFTAbi,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider!
      );

      const supply: number = contract["totalSupply"]().then((balance: BigNumber) =>
        balance.toNumber()
      );

      return supply;
    },
    { enabled: !!provider && !!address }
  );
};

export const useBpMintMutation = ({
  proof1,
  proof2,
}: {
  proof1: string[];
  proof2: string[];
}) => {
  const { provider, address, chainId } = useWeb3Context();
  const dispatch: AppDispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ["mintBalancePass"],
    () => {
      const signer = provider?.getSigner();

      const contract = new ethers.Contract(bpContractAddress, passNFTAbi, signer);

      try {
        const mintTx = contract["mint"](proof1, proof2)
          .then((txn: ContractTransaction) => txn.wait())
          .then((receipt: ContractReceipt) => {
            console.log(receipt);
          });
        return mintTx;
      } catch (e: any) {
        if (e.error === undefined) {
          let message;
          if (e.message === "Internal JSON-RPC error.") {
            message = e.data.message;
          } else {
            message = e.message;
          }
          if (typeof message === "string") {
            dispatch(error(`Unknown error: ${message}`));
          }
        } else {
          dispatch(error(`Unknown error: ${e.error.message}`));
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bpGetWalletBalance"]);
        queryClient.invalidateQueries(["bpGetTotalSupply"]);
      },
    }
  );

  return { mutation };
};
