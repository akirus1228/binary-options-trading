import { loadState, setAll } from "@fantohm/shared-web3";
import {
  createSlice,
  createSelector,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { RootState } from "../index";

interface AppData {
  readonly loading: boolean;
  readonly checkedConnection: boolean;
}

const previousState = loadState("app");
const initialState: AppData = {
  ...previousState,
  loading: true,
  checkedConnection: false,
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
  },
  extraReducers: (builder) => { },
});

const baseInfo = (state: RootState) => state.app;

export const appReducer = appSlice.reducer;
export const { setLoading, setCheckedConnection } = appSlice.actions;
export const getAppState = createSelector(baseInfo, (app) => app);