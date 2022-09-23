import { loadState } from "@fantohm/shared-web3";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BackendApi } from "../../api";
import { AffiliateData } from "../../types/backend-types";

export type AffiliateState = {
  data: AffiliateData;
  status: "pending" | "ready" | "failed";
};

const previousState = loadState("affiliate");
const initialState: AffiliateState = {
  ...previousState,
  data: {
    referralCode: "",
    referredAddresses: [],
    totalClaimedAmount: 0,
    claimableTokens: [],
  },
  status: "pending",
};
/*
Referral data: 
  referral code
  referredAddresses
  total claimed amount
  claimable token info
params:
- address: string
returns: void
*/
export const getAffiliateStats = createAsyncThunk(
  "backend/affiliate",
  async (address: string, { getState, rejectWithValue, dispatch }) => {
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      const response = await BackendApi.getAffiliate(
        thisState.backend.authSignature,
        address
      );
      return response;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

export const saveAffiliateCode = createAsyncThunk(
  "backend/save-affiliate",
  async (
    {
      address,
      referralCode,
    }: {
      address: string;
      referralCode: string;
    },
    { getState, rejectWithValue, dispatch }
  ) => {
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      const response = await BackendApi.saveAffiliate(
        thisState.backend.authSignature,
        address,
        referralCode
      );
      return response;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

export const affilateSlice = createSlice({
  name: "affiliate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAffiliateStats.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(
      getAffiliateStats.fulfilled,
      (state, action: PayloadAction<AffiliateData | undefined>) => {
        console.log("affilateFullfiled: ", action);
        if (action.payload) {
          state.status = "ready";
          state.data = {
            ...state.data,
            ...action.payload,
          };
          console.log("fullfillState: ", state);
        }
      }
    );
    builder.addCase(getAffiliateStats.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

// Action creators are generated for each case reducer function
export const affiliateReducer = affilateSlice.reducer;
