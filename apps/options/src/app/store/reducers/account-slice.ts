import { isDev, NetworkIds } from "@fantohm/shared-web3";
import { ethers, BigNumber } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "../index";
import { desiredNetworkId, BINARY_ADDRESSES } from "../../core/constants/network";
import erc20ABI from "../../core/abi/ERC20.json";
import daiABI from "../../core/abi/DAI.json";
import { useSelector } from "react-redux";

export type Erc20Allowance = {
  [tokenIdentifier: string]: BigNumber;
};

export interface AccountDetail {
  dai: {
    balance: BigNumber;
    allowance: BigNumber;
  };
}

export interface IBaseAddressAsyncThunk {
  readonly address: string;
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
}

export interface Erc20AllowanceAsyncThunk {
  readonly walletAddress: string;
  readonly assetAddress: string;
  readonly networkId: NetworkIds;
  readonly provider: JsonRpcProvider;
  readonly vaultContractAddress: string;
  readonly amount: BigNumber;
}

export const getAccountDetails = createAsyncThunk(
  "account/getAccountDetails",
  async ({ address, networkId, provider }: IBaseAddressAsyncThunk) => {
    if (!address || !networkId || !provider) {
      return {
        dai: {
          balance: BigNumber.from(0),
          allowance: BigNumber.from(0),
        },
      };
    }
    const daiContract = new ethers.Contract(
      BINARY_ADDRESSES[desiredNetworkId].DAI_ADDRESS,
      isDev ? erc20ABI : daiABI,
      provider.getSigner()
    );
    const daiBalance = await daiContract["balanceOf"](address);
    const daiAllowance = await daiContract["allowance"](
      address,
      "0x45e7953E6970A3486F6499A4b9eA85B4fB6B1715"
    );

    return {
      dai: {
        balance: daiBalance,
        allowance: daiAllowance,
      },
    };
  }
);

export const requestERC20Allowance = createAsyncThunk(
  "account/requestErc20Allowance",
  async (
    {
      networkId,
      provider,
      walletAddress,
      assetAddress,
      amount,
      vaultContractAddress,
    }: Erc20AllowanceAsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress) {
      return rejectWithValue("Addresses and id required");
    }
    try {
      const signer = provider.getSigner();
      const erc20Contract = new ethers.Contract(assetAddress, erc20ABI, signer);
      const approveTx = await erc20Contract["approve"](vaultContractAddress, amount);
      await approveTx.wait();
      const payload: Erc20Allowance = {};
      payload[`${walletAddress}:::${assetAddress.toLowerCase()}`] = amount;
      return payload;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

export interface AccountState {
  readonly checkPermStatus: "idle" | "pending" | "fulfilled" | "failed";
  readonly requestErc20AllowanceStatus: "idle" | "pending" | "fulfilled" | "failed";
  readonly accountDetail: AccountDetail;
}

const initialState: AccountState = {
  accountDetail: {
    dai: {
      balance: BigNumber.from(0),
      allowance: BigNumber.from(0),
    },
  },
  checkPermStatus: "idle",
  requestErc20AllowanceStatus: "idle",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAccountDetails.pending, (state) => {
      state.checkPermStatus = "pending";
    });
    builder.addCase(getAccountDetails.fulfilled, (state, action: PayloadAction<any>) => {
      state.checkPermStatus = "fulfilled";
      state.accountDetail = action.payload;
    });
    builder.addCase(getAccountDetails.rejected, (state) => {
      state.checkPermStatus = "failed";
    });
    builder.addCase(requestERC20Allowance.pending, (state) => {
      state.requestErc20AllowanceStatus = "pending";
    });
    builder.addCase(requestERC20Allowance.fulfilled, (state, action) => {
      state.requestErc20AllowanceStatus = "fulfilled";
    });
    builder.addCase(requestERC20Allowance.rejected, (state) => {
      state.requestErc20AllowanceStatus = "failed";
    });
  },
});

const baseInfo = (state: RootState) => state.account;

export const accountReducer = accountSlice.reducer;
export const getAccountState = createSelector(baseInfo, (account) => account);
