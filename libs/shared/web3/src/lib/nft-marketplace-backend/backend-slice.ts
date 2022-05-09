import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadState } from "../helpers/localstorage";
import { SignerAsyncThunk, ListingAsyncThunk } from "../slices/interfaces";
import { BackendApi } from ".";
import { Asset, AssetStatus, Listing, LoginResponse } from "./backend-types";
import { updateAsset } from "../wallet/wallet-slice";

export interface MarketplaceApiData {
  readonly accountStatus: "unknown" | "pending" | "ready" | "failed";
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly loadAssetStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly loadListingStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly createListingStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly authSignature: string | null;
  listings: Listing[];
}

/* 
authorizeAccount: generates user account if non existant 
  requests signature to create bearer token
params: 
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const authorizeAccount = createAsyncThunk(
  "marketplaceApi/authorizeAccount",
  async (
    { address, networkId, provider }: SignerAsyncThunk,
    { dispatch, rejectWithValue, getState }
  ) => {
    const loginResponse: LoginResponse = await BackendApi.doLogin(address);
    if (loginResponse.id) {
      const signature = await BackendApi.handleSignMessage(address, provider);
      if (!signature) {
        rejectWithValue("Login Failed");
      }
      return signature;
    } else {
      rejectWithValue("Login Failed");
    }
  }
);

/* 
loadListings: loads all listings
params: 
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const loadListings = createAsyncThunk(
  "marketplaceApi/loadListings",
  async (
    { address, provider, networkId }: SignerAsyncThunk,
    { getState, rejectWithValue }
  ) => {
    //const signature = await handleSignMessage(address, provider);
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      return await BackendApi.getListings(
        address,
        thisState.nftMarketplace.authSignature
      );
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

/* 
createListing: loads all listings
params: 
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const createListing = createAsyncThunk(
  "marketplaceApi/createListing",
  async ({ asset, terms }: ListingAsyncThunk, { getState, rejectWithValue }) => {
    console.log("backend-slice: createListing");
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      if (
        !BackendApi.createListing(thisState.nftMarketplace.authSignature, asset, terms)
      ) {
        return rejectWithValue("Failed to create listing");
      }
      return true;
    } else {
      console.warn("no auth");
      return rejectWithValue("No authorization found.");
    }
  }
);

/* 
loadAsset: loads all listings
params: 
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const loadAsset = createAsyncThunk(
  "marketplaceApi/loadAsset",
  async (asset: Asset, { getState, rejectWithValue, dispatch }) => {
    console.log("loadAssest called");
    if (!asset.openseaId) {
      console.log("no id");
      return false;
    }
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      console.log("sig found");
      const apiAsset = await BackendApi.getAssetFromOpenseaId(
        asset.openseaId,
        thisState.nftMarketplace.authSignature
      );
      console.log("apiAsset");
      console.log(apiAsset);
      if (!apiAsset.id) {
        // nothing found by the API, merge in default state
        console.log("No asset found. New asset");
        dispatch(updateAsset({ ...asset, status: AssetStatus.New, backendLoaded: true }));
      } else {
        dispatch(updateAsset({ ...apiAsset, backendLoaded: true }));
      }

      return true;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

// initial wallet slice state
const previousState = loadState("nftMarketplace");
const initialState: MarketplaceApiData = {
  accountStatus: "unknown",
  authSignature: null,
  ...previousState,
  status: "idle",
  loadAssetStatus: "idle",
  loadListingStatus: "idle",
  createListingStatus: "idle",
};

// create slice and initialize reducers
const marketplaceApiSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authorizeAccount.pending, (state, action) => {
      state.accountStatus = "pending";
    });
    builder.addCase(authorizeAccount.fulfilled, (state, action) => {
      if (action.payload) {
        state.accountStatus = "ready";
        state.authSignature = action.payload;
      }
    });
    builder.addCase(authorizeAccount.rejected, (state, action) => {
      state.accountStatus = "failed";
    });
    builder.addCase(loadListings.pending, (state, action) => {
      state.loadListingStatus = "loading";
    });
    builder.addCase(
      loadListings.fulfilled,
      (state, action: PayloadAction<Listing[] | undefined>) => {
        state.loadListingStatus = "succeeded";
        if (action.payload) {
          state.listings = [...state.listings, ...action.payload];
        }
      }
    );
    builder.addCase(loadListings.rejected, (state, action) => {
      state.loadListingStatus = "failed";
    });
    builder.addCase(loadAsset.pending, (state, action) => {
      state.loadAssetStatus = "loading";
    });
    builder.addCase(loadAsset.fulfilled, (state, action) => {
      state.loadAssetStatus = "succeeded";
    });
    builder.addCase(loadAsset.rejected, (state, action) => {
      state.loadAssetStatus = "failed";
    });
    builder.addCase(createListing.pending, (state, action) => {
      state.createListingStatus = "loading";
    });
    builder.addCase(createListing.fulfilled, (state, action) => {
      state.createListingStatus = "succeeded";
    });
    builder.addCase(createListing.rejected, (state, action) => {
      state.createListingStatus = "failed";
    });
  },
});

export const marketplaceApiReducer = marketplaceApiSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
//export const {} = walletSlice.actions;
