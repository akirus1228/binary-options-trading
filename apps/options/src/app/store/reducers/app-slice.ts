import { loadState } from "@fantohm/shared-web3";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../index";
import { CryptoCurrency } from "../../core/types/types";
import { BettingCryptoCurrencies } from "../../core/constants/basic";

interface AppData {
  readonly loading: boolean;
  readonly checkedConnection: boolean;
  readonly underlyingToken: CryptoCurrency;
}

const previousState = loadState("app");
const initialState: AppData = {
  ...previousState,
  loading: true,
  checkedConnection: false,
  underlyingToken: BettingCryptoCurrencies[0],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCheckedConnection: (state, action: PayloadAction<boolean>) => {
      state.checkedConnection = action.payload;
    },
    setUnderlyingToken: (state, action: PayloadAction<CryptoCurrency>) => {
      state.underlyingToken = action.payload;
    },
  },
});

const baseInfo = (state: RootState) => state.app;

export const appReducer = appSlice.reducer;
export const { setLoading, setCheckedConnection, setUnderlyingToken } = appSlice.actions;
export const getAppState = createSelector(baseInfo, (app) => app);
