import {
  addresses,
  balanceVaultManager,
  getErc20CurrencyFromAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useEffect } from "react";
import { BalanceVault, BalanceVaultRaw } from "./use-balance-vault";

// types
export type GetPositionsPageResponse = VaultPosition[];

export type VaultPosition = {
  vaultAddress: string;
  index: BigNumber;
  nftAddress: string;
  userAddress: string;
  amounts: BigNumber[];
  tokens: string[];
  totalUsdValue: number;
};

export type UseBvmGetPositionsResponse = {
  data: VaultPosition[] | undefined;
  isLoading: boolean;
  error: unknown;
};

/**
 * Returns vault poisitions from the BalanceVaultManager contract.
 *
 * @param userAddress Address of user to lookiup positions for.
 * @param skip Skip this many positions.
 * @param take Positions per page to return.
 *
 */
export const useBvmGetPositions = (
  userAddress: string,
  skip: number,
  take: number
): UseBvmGetPositionsResponse => {
  const { provider, address, chainId } = useWeb3Context();

  const { data, isLoading, error } = useQuery(
    ["getPositions"],
    () => {
      const contract = new ethers.Contract(
        addresses[chainId ?? 4]["BALANCE_VAULT_MANAGER_ADDRESS"] ?? "",
        balanceVaultManager,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider!
      );
      return contract["getPositionsPage"](userAddress, skip, take).then(
        (res: GetPositionsPageResponse) => {
          return res.map((vaultPosition: VaultPosition) => ({
            vaultAddress: vaultPosition.vaultAddress,
            index: vaultPosition.index,
            nftAddress: vaultPosition.nftAddress,
            userAddress: vaultPosition.userAddress,
            amounts: vaultPosition.amounts,
            tokens: vaultPosition.tokens,
            totalUsdValue: getUsdValue(
              vaultPosition.amounts,
              vaultPosition.tokens,
              chainId ?? 4
            ),
          }));
        }
      );
    },
    { enabled: provider !== null && !!address }
  );

  useEffect(() => {
    console.log(error);
  }, [error]);

  return { data, isLoading, error };
};

export type GetGeneratedVaultsResponse = BalanceVaultRaw[];
export type UseBvmGetGeneratedVaultsResponse = {
  data: BalanceVault[] | undefined;
  isLoading: boolean;
  error: unknown;
};

/**
 * Returns generated vaults from the BalanceVaultManager contract.
 *
 * @param skip Skip this many positions.
 * @param take Positions per page to return.
 *
 */
export const useBvmGetGeneratedVaults = (
  skip: number,
  take: number
): UseBvmGetGeneratedVaultsResponse => {
  const { provider, address, chainId } = useWeb3Context();

  const { data, isLoading, error } = useQuery(
    ["getGeneratedVaults"],
    () => {
      const contract = new ethers.Contract(
        addresses[chainId ?? 4]["BALANCE_VAULT_MANAGER_ADDRESS"] ?? "",
        balanceVaultManager,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider! // we know provider is available from the enabled condition
      );
      return contract["getGeneratedVaultsPage"](skip, take).then(
        (res: BalanceVaultRaw[]) => {
          return res.map((vaultData: BalanceVaultRaw) => ({
            vaultAddress: vaultData.vaultAddress,
            name: vaultData.ownerInfos[0],
            description: vaultData.ownerInfos[1],
            nftAddress: vaultData.nftAddress,
            ownerName: vaultData.ownerInfos[0],
            ownerContacts: vaultData.ownerContacts,
            ownerWallet: vaultData.ownerWallet,
            fundingAmount: vaultData.fundingAmount,
            fundsRaised: vaultData.fundraised,
            allowedTokens: vaultData.allowedTokens,
            freezeTimestamp: vaultData.freezeTimestamp.toNumber(),
            repaymentTimestamp: vaultData.repaymentTimestamp.toNumber(),
            apr: vaultData.apr.toNumber(),
            shouldBeFrozen: vaultData.shouldBeFrozen,
            lockDuration:
              (vaultData.repaymentTimestamp as BigNumber).toNumber() -
              (vaultData.freezeTimestamp as BigNumber).toNumber(),
          }));
        }
      );
    },
    { enabled: provider !== null && !!address }
  );

  useEffect(() => {
    console.log(error);
  }, [error]);

  return { data, isLoading, error };
};

export const getUsdValue = (
  amounts: BigNumber[],
  tokens: string[],
  networkId: number
): number => {
  return amounts.reduce(
    (previousAmt, currentAmt, currentIndex) =>
      previousAmt +
      +formatUnits(
        currentAmt,
        getErc20CurrencyFromAddress(tokens[currentIndex], networkId).decimals
      ),
    0
  );
};
