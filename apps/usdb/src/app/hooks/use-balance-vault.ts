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

export type BalanceVaultRaw = {
  allowedTokens: string[];
  apr: BigNumber;
  freezeTimestamp: BigNumber;
  fundingAmount: BigNumber;
  fundraised: BigNumber;
  index: BigNumber;
  nftAddress: string;
  ownerContacts: string[];
  ownerInfos: string[];
  ownerWallet: string;
  repaymentTimestamp: BigNumber;
  shouldBeFrozen: boolean;
  vaultAddress: string;
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
      const contract = new ethers.Contract(
        contractAddress ?? "",
        balanceVaultAbi,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

export type BalanceOfResponse = {
  _amounts: BigNumber[];
  _tokens: string[];
};

export type PositionData = {
  tokenId: string;
  amount: BigNumber;
};

export type UseBalanceVaultPositionResponse = {
  positionData: PositionData[] | undefined;
  isLoading: boolean;
  error: unknown;
};

export const useBalanceVaultPosition = (
  contractAddress: string
): UseBalanceVaultPositionResponse => {
  const { provider, address } = useWeb3Context();

  const {
    data: positionData,
    isLoading,
    error,
  } = useQuery(
    ["vaultPosition"],
    () => {
      const contract = new ethers.Contract(
        contractAddress ?? "",
        balanceVaultAbi,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider!
      );
      const position = contract["balanceOf(address)"](address).then(
        (res: BalanceOfResponse) =>
          res._amounts.map(
            (_amount: BigNumber, amountIndex: number) =>
              ({
                tokenId: res._tokens[amountIndex],
                amount: _amount,
              } as PositionData)
          )
      );
      return position;
    },
    { enabled: provider !== null && !!address }
  );

  useEffect(() => {
    console.log(error);
  }, [error]);

  return { positionData, isLoading, error };
};
