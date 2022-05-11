import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { ierc20Abi, ierc721Abi } from "../abi";
import { addresses } from "../constants";
import { loadState } from "../helpers";
import { NetworkIds } from "../networks";
import { chains } from "../providers";
import { AssetLocAsyncThunk, IBaseAddressAsyncThunk } from "../slices/interfaces";

export enum AcceptedCurrencies {
  USDB,
  WETH,
  DAI,
  FTM,
  USDC,
}

export interface Currency {
  symbol: AcceptedCurrencies;
  name: string;
  balance: string;
}

export type NftPermStatus = {
  [key: string]: boolean;
};

export interface WalletData {
  readonly currencyStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly checkPermStatus: "idle" | "loading" | "failed";
  readonly requestPermStatus: "idle" | "loading" | "failed";
  readonly nftPermStatus: NftPermStatus;
  readonly currencies: Currency[];
  readonly isDev: boolean;
}

const cacheTime = 300 * 1000; // 5 minutes

/* 
loadWalletBalance: loads balances
params: 
- networkId: number
- address: string
returns: void
*/
export const loadWalletCurrencies = createAsyncThunk(
  "wallet/loadWalletCurrencies",
  async ({ networkId, address }: IBaseAddressAsyncThunk) => {
    // console.log("loading wallet balances");
    const provider = await chains[networkId].provider;

    const usdbContract = new ethers.Contract(
      addresses[networkId]["USDB_ADDRESS"] as string,
      ierc20Abi,
      provider
    );

    const usdbBalance = await usdbContract["balanceOf"](address);
    return [
      {
        symbol: AcceptedCurrencies.USDB,
        name: "USDBalance",
        balance: ethers.utils.formatUnits(usdbBalance, "gwei"),
      } as Currency,
    ];
  }
);

/* 
requestNftPermission: loads nfts owned by specific address
params: 
- address: string
returns: void
*/
export const requestNftPermission = createAsyncThunk(
  "wallet/requestNftPermission",
  async (
    { networkId, provider, walletAddress, assetAddress, tokenId }: AssetLocAsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress || !tokenId) {
      return rejectWithValue("Addresses and id required");
    }
    try {
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(assetAddress, ierc721Abi, signer);
      const response = await nftContract["approve"](
        addresses[networkId]["USDB_LENDING_ADDRESS"] as string,
        tokenId
      );
      console.log(response);
      return { assetAddress, tokenId };
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

/* 
checkNftPermission: loads nfts owned by specific address
params: 
- networkId: string
- provider: JsonRpcProvider
- walletAddress: string
- assetAddress: string
- tokenId: string
returns: RejectWithValue<unknown,unknown> | { assetAddress: string, tokenId: string, hasPermission: boolean}
*/
export const checkNftPermission = createAsyncThunk(
  "wallet/checkNftPermission",
  async (
    { networkId, provider, walletAddress, assetAddress, tokenId }: AssetLocAsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress || !tokenId) {
      return rejectWithValue("Addresses and id required");
    }
    if (networkId != NetworkIds.Ethereum && networkId != NetworkIds.Rinkeby) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NetworkIds.Rinkeby }],
      });
    }
    try {
      const nftContract = new ethers.Contract(assetAddress, ierc721Abi, provider);
      const response = await nftContract["getApproved"](tokenId);
      console.log(response);
      const hasPermission = response.includes(
        addresses[networkId]["USDB_LENDING_ADDRESS"]
      );
      return { assetAddress, tokenId, hasPermission };
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

// initial wallet slice state
const previousState = loadState("wallet");
const initialState: WalletData = {
  currencies: [],
  ...previousState, // overwrite assets and currencies from cache if recent
  nftPerms: [],
  currencyStatus: "idle", // always reset states on reload
  checkPermStatus: "idle",
  requestPermStatus: "idle",
};

// create slice and initialize reducers
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadWalletCurrencies.pending, (state, action) => {
      state.currencyStatus = "loading";
    });
    builder.addCase(loadWalletCurrencies.fulfilled, (state, action) => {
      state.currencyStatus = "succeeded";
      // console.log(action.payload);
      state.currencies = action.payload;
    });
    builder.addCase(loadWalletCurrencies.rejected, (state, action) => {
      state.currencyStatus = "failed";
    });
    builder.addCase(checkNftPermission.pending, (state, action) => {
      state.checkPermStatus = "loading";
    });
    builder.addCase(
      checkNftPermission.fulfilled,
      (
        state,
        action: PayloadAction<{
          assetAddress: string;
          tokenId: string;
          hasPermission: boolean;
        }>
      ) => {
        state.checkPermStatus = "idle";
        state.nftPermStatus[
          `${action.payload.tokenId}:::${action.payload.assetAddress}`
        ] = action.payload.hasPermission;
      }
    );
    builder.addCase(checkNftPermission.rejected, (state, action) => {
      state.checkPermStatus = "failed";
    });
    builder.addCase(requestNftPermission.pending, (state, action) => {
      state.requestPermStatus = "loading";
    });
    builder.addCase(
      requestNftPermission.fulfilled,
      (
        state,
        action: PayloadAction<{
          assetAddress: string;
          tokenId: string;
        }>
      ) => {
        state.requestPermStatus = "idle";
        state.nftPermStatus[
          `${action.payload.tokenId}:::${action.payload.assetAddress}`
        ] = true;
      }
    );
    builder.addCase(requestNftPermission.rejected, (state, action) => {
      state.requestPermStatus = "failed";
    });
  },
});

export const walletReducer = walletSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
// export const {} = assetsSlice.actions;