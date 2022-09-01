import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";

import { balanceVaultAbi } from "../abi";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { error, info } from "./messages-slice";
import { IVaultDepositAsyncThunk, IVaultWithdrawAsyncThunk } from "./interfaces";

export type BalanceVault = {
  vaultAddress: string;
  index: string;
  nftAddress: string;
  ownerInfos: string[];
  ownerContacts: string[];
  ownerWallet: string;
  fundingAmount: string;
  fundraised: string;
  allowedTokens: string[];
  freezeTimestamp: string;
  repaymentTimestamp: string;
  apr: string;
  shouldBeFrozen: boolean;
};

export interface BalanceVaultState {
  vaults: Map<string, BalanceVault>;
}

export const getVaultDetails = createAsyncThunk(
  "asset/updateAssetsFromOpensea",
  async (vaultAddress: string) => {
    return {} as BalanceVault;
  }
);

const initialState: BalanceVaultState = {
  vaults: new Map(),
};

// create slice and initialize reducers
const balanceVaultSlice = createSlice({
  name: "balanceVault",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVaultDetails.pending, (state) => {
        // pending
      })
      .addCase(getVaultDetails.fulfilled, (state, action) => {
        // fulfilled
      })
      .addCase(getVaultDetails.rejected, (state, { error }) => {
        // rejected, handle error
      });
  },
});

export const balanceVaultReducer = balanceVaultSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
// export const { } = balanceVaultSlice.actions;

export const vaultDeposit = createAsyncThunk(
  "balance-vault/vaultDeposit",
  async (
    { address, vaultId, amount, token, provider, networkId }: IVaultDepositAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const vaultContract = new ethers.Contract(
      vaultId,
      balanceVaultAbi,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      signer
    );

    let depositTx;

    try {
      depositTx = await vaultContract["deposit"](amount, token);
      dispatch(
        fetchPendingTxns({
          txnHash: depositTx.hash,
          text: "Depositing",
          type: "balance_vault_deposit_" + token,
        })
      );
      await depositTx.wait();
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
      return;
    } finally {
      if (depositTx) {
        dispatch(info("Deposit successful."));
        dispatch(clearPendingTxn(depositTx.hash));
      }
    }
  }
);
export const vaultWithdraw = createAsyncThunk(
  "balance-vault/vaultWithdraw",
  async (
    { address, vaultId, provider, networkId }: IVaultWithdrawAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const vaultContract = new ethers.Contract(
      vaultId,
      balanceVaultAbi,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      signer
    );

    let withdrawTx;

    try {
      withdrawTx = await vaultContract["withdraw"]();
      dispatch(
        fetchPendingTxns({
          txnHash: withdrawTx.hash,
          text: "Withdrawing",
          type: "balance_vault_withdraw",
        })
      );
      await withdrawTx.wait();
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
      return;
    } finally {
      if (withdrawTx) {
        dispatch(info("Withdraw successful."));
        dispatch(clearPendingTxn(withdrawTx.hash));
      }
    }
  }
);