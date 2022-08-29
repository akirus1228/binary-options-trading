import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
