import { balanceVaultAbi, useWeb3Context } from "@fantohm/shared-web3";
import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useEffect } from "react";

export type BalanceVault = {
  vaultAddress: string;
  name: string;
  description: string;
  nftAddress: string;
  ownerName: string;
  ownerContacts: string[];
  ownerWallet: string;
  fundingAmount: BigNumber;
  fundsRaised: BigNumber;
  allowedTokens: string[];
  freezeTimestamp: number;
  repaymentTimestamp: number;
  apr: number;
  shouldBeFrozen: boolean;
  lockDuration: number;
};

export type UseBalanceVaultResponse = {
  vaultData: BalanceVault | undefined;
  isLoading: boolean;
  error: unknown;
};

export const useBalanceVault = (contractAddress: string): UseBalanceVaultResponse => {
  const { provider, address } = useWeb3Context();

  const {
    data: vaultData,
    isLoading,
    error,
  } = useQuery(
    ["vault"],
    () => {
      console.log("query running");
      console.log("query actually running");
      const contract = new ethers.Contract(
        contractAddress ?? "",
        balanceVaultAbi,
        provider!
      );
      const vaultName = contract["ownerName"]();
      const vaultDescription = contract["ownerDescription"]();
      const vaultFunding = contract["fundingAmount"]();
      const vaultFundsRaised = contract["fundraised"]();
      const vaultAllowedTokens = contract["getAllowedTokens"]();
      const vaultApr = contract["apr"]();
      const owner = contract["owner"]();
      const ownerContacts = contract["getOwnerContacts"]();
      const nftAddress = contract["nft"]();
      const ownerWallet = contract["ownerWallet"]();
      const freezeTimestamp = contract["freezeTimestamp"]();
      const repaymentTimestamp = contract["repaymentTimestamp"]();
      const shouldBeFrozen = contract["shouldBeFrozen"]();

      return Promise.all([
        vaultName,
        vaultDescription,
        vaultFunding,
        vaultFundsRaised,
        vaultAllowedTokens,
        vaultApr,
        owner,
        ownerContacts,
        nftAddress,
        ownerWallet,
        freezeTimestamp,
        repaymentTimestamp,
        shouldBeFrozen,
      ]).then((res) => {
        return {
          vaultAddress: contractAddress,
          name: res[0] as string,
          description: res[1] as string,
          nftAddress: res[8] as string,
          fundingAmount: res[2] as BigNumber,
          fundsRaised: res[3] as BigNumber,
          allowedTokens: res[4] as string[],
          apr: (res[5] as BigNumber).toNumber(),
          ownerName: res[6] as string,
          ownerContacts: res[7] as string[],
          ownerWallet: res[9] as string,
          freezeTimestamp: (res[10] as BigNumber).toNumber(),
          repaymentTimestamp: (res[11] as BigNumber).toNumber(),
          shouldBeFrozen: res[12] as boolean,
          lockDuration:
            (res[11] as BigNumber).toNumber() - (res[10] as BigNumber).toNumber(),
        };
      });
    },
    { enabled: provider !== null && !!address }
  );

  useEffect(() => {
    console.log(error);
  }, [error]);

  return { vaultData, isLoading, error };
};
