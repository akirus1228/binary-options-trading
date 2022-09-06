import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { isDev } from "@fantohm/shared-web3";
import { FetchArgs } from "@reduxjs/toolkit/dist/query";
import * as queryString from "query-string";

export type NftPortConfig = {
  apiKey: string;
  apiEndpoint: string;
  chain: "rinkeby" | "ethereum";
};

const nftPortConfig = (): NftPortConfig => {
  return {
    apiKey: "218fce34-47cb-4d03-a65d-a81effe8d661",
    apiEndpoint: "https://api.nftport.xyz",
    chain: isDev ? "rinkeby" : "ethereum",
  };
};

export type NftPortAssetsQueryParams = {
  continuation?: string;
  contract_address?: string;
  exclude?: ("erc721" | "erc1155")[];
  include?: ("default" | "metadata" | "contract_information")[]; // default
  page_size?: number; // 50
};

export type NftPortAsset = {
  contract_address: string;
  token_id: string;
};

export type NftPortAssetQueryResponse = {
  response: string;
  nfts: NftPortAsset[];
  total: number;
  continuation?: string;
};

const staggeredBaseQuery = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: nftPortConfig().apiEndpoint,
      prepareHeaders: (headers) => {
        headers.set("Authorization", nftPortConfig().apiKey);
        return headers;
      },
      paramsSerializer: (params: NftPortAssetsQueryParams) =>
        queryString.stringify(
          { ...params, chain: nftPortConfig().chain },
          { arrayFormat: "none" }
        ),
    })(args, api, extraOptions);
    if (result.error) {
      // fail immediatly if it's a 500 error
      if (result.error?.status === 500) {
        retry.fail(result.error);
      }
    }
    return result;
  },
  {
    maxRetries: 5,
  }
);

export const nftPortApi = createApi({
  reducerPath: "nftportApi",
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getRawNftPortAssets: builder.query<
      NftPortAssetQueryResponse,
      NftPortAssetsQueryParams & {
        account_address: string;
      }
    >({
      query: (queryParams) => ({
        url: `v0/accounts/${queryParams.account_address}`,
        params: {
          exclude: ["erc1155"],
          include: ["metadata", "contract_information"],
          ...queryParams,
        },
      }),
    }),
  }),
});

export const { useGetRawNftPortAssetsQuery } = nftPortApi;
