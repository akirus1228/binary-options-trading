import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { isDev } from "@fantohm/shared-web3";
import { FetchArgs } from "@reduxjs/toolkit/dist/query";

type ReservoirConfig = {
  apiKey: string;
  apiEndpoint: string;
};

type ReservoirGetCollectionsRequest = {
  user: string;
  community?: string;
  collectionsSetId?: string;
  collection?: string;
  includeTopBid?: boolean;
  includeLiquidCount?: boolean;
  offset?: number;
  limit: number;
};

type ReservoirCollection = {
  collection: {
    id: string;
    slug: string;
    name: string;
    image?: string;
    banner?: string;
    discordUrl?: string;
    externalUrl?: string;
    twitterUsername?: string;
    description?: string;
    sampleImages?: string[];
    tokenCount?: string;
    primaryContract: string;
    tokenSetId: string;
    floorAskPrice: number;
    rank: {
      "1day": number;
      "7day": number;
      "30day": number;
      allTime: number;
    };
    volume: {
      "1day": number;
      "7day": number;
      "30day": number;
      allTime: number;
    };
    volumeChange: {
      "1day": number;
      "7day": number;
      "30day": number;
    };
    floorSale: {
      "1day": number;
      "7day": number;
      "30day": number;
    };
    topBidValue?: number;
    topBidMaker?: string;
    ownership: {
      tokenCount: string;
      onSaleCount: string;
      liquidCount: string;
    };
  };
};

type ReservoirGetCollectionsResponse = {
  collections: ReservoirCollection[];
};

const reservoirConfig: ReservoirConfig = {
  apiKey: isDev
    ? "54ec25f8-1f80-5ba7-9adb-63dbaf555af2"
    : "54ec25f8-1f80-5ba7-9adb-63dbaf555af2",
  apiEndpoint: isDev
    ? "https://api-rinkeby.reservoir.tools/"
    : "https://api.reservoir.tools/",
};

const staggeredBaseQuery = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: reservoirConfig.apiEndpoint,
      prepareHeaders: (headers) => {
        headers.set("X-API-KEY", reservoirConfig.apiKey);
        return headers;
      },
    })(args, api, extraOptions);
    if (result.error) {
      //alert("Fetching metadata, please wait...");
      //console.log("error being thrown");
      //console.log(result.error);
    }
    return result;
  },
  {
    maxRetries: 5,
  }
);

export const reservoirApi = createApi({
  reducerPath: "reservoirApi",
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getCollections: builder.query<
      ReservoirGetCollectionsResponse,
      ReservoirGetCollectionsRequest
    >({
      query: ({ user, ...queryParams }) => ({
        url: `users/${user}/collections/v2`,
        params: queryParams,
      }),
    }),
  }),
});

export const { useGetCollectionsQuery } = reservoirApi;
