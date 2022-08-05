// external libs
import axios, { AxiosResponse } from "axios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { JsonRpcProvider } from "@ethersproject/providers";

// internal libs
import {
  AllAssetsResponse,
  AllListingsResponse,
  Asset,
  CreateAssetResponse,
  CreateListingRequest,
  Listing,
  LoginResponse,
  Terms,
  Notification,
  CreateListingResponse,
  Loan,
  Offer,
  BackendAssetQueryParams,
  BackendLoanQueryParams,
  BackendOfferQueryParams,
  BackendStandardQuery,
  PlatformWalletInfo,
  BackendNotificationQueryParams,
  Collection,
  BackendCollectionQuery,
  User,
  NftPrice,
} from "../types/backend-types";
import { ListingQueryParam } from "../store/reducers/interfaces";
import { RootState } from "../store";
import {
  assetAryToAssets,
  dropHelperDates,
  listingAryToListings,
  listingToCreateListingRequest,
} from "../helpers/data-translations";
import {
  updateAsset,
  updateAssets,
  updateAssetsFromListings,
} from "../store/reducers/asset-slice";
import { updateListing, updateListings } from "../store/reducers/listing-slice";
import { isDev } from "@fantohm/shared-web3";

export const WEB3_SIGN_MESSAGE =
  "This application uses this cryptographic signature, verifying that you are the owner of this address.";
// TODO: use production env to determine correct endpoint
export const NFT_MARKETPLACE_API_URL = isDev
  ? "https://liqd-nft-lending-test.herokuapp.com/api"
  : "https://liqd-nft-lending-production.herokuapp.com/api";

export const doLogin = (address: string): Promise<LoginResponse> => {
  const url = `${NFT_MARKETPLACE_API_URL}/auth/login`;
  return axios.post(url, { address }).then((resp: AxiosResponse<LoginResponse>) => {
    return resp.data;
  });
};

export const postAsset = (asset: Asset, signature: string): Promise<Asset> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset`;
  return axios
    .post(url, asset, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<CreateAssetResponse>) => {
      return resp.data.asset;
    })
    .catch((err) => {
      // most likely a 400 (not in our database)

      return {} as Asset;
    });
};

export const getListingByOpenseaIds = (
  openseaIds: string[],
  signature: string
): Promise<Listing> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing/all?openseaId=${openseaIds.join(
    ","
  )}`;

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllListingsResponse>) => {
      const { term, ...listing } = resp.data.data[0];
      return { ...listing, term: term };
    });
};

export const createListing = (
  signature: string,
  asset: Asset,
  term: Terms
): Promise<Listing | boolean> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing`;
  const listingParams = listingToCreateListingRequest(asset, term);
  // post
  return axios
    .post(url, listingParams, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<CreateListingResponse>) => {
      return createListingResponseToListing(resp.data);
    })
    .catch((err: AxiosResponse) => {
      return false;
    });
};

export const handleSignMessage = async (
  address: string,
  provider: JsonRpcProvider
): Promise<string> => {
  const signer = provider.getSigner(address);
  try {
    return (await signer.signMessage(WEB3_SIGN_MESSAGE)) as string;
  } catch (e) {
    return "";
  }
};

const createListingResponseToListing = (
  createListingResponse: CreateListingResponse
): Listing => {
  const { term, ...listing } = createListingResponse;
  return { ...listing, term: term };
};

const notificationDateOldestFirst = (a: Notification, b: Notification): number => {
  if (!a.createdAt || !b.createdAt) return 0;
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
};

const standardQueryParams: BackendStandardQuery = {
  skip: 0,
  take: 50,
};

export const backendApi = createApi({
  reducerPath: "backendApi",
  tagTypes: [
    "Asset",
    "Collection",
    "Listing",
    "Loan",
    "Notification",
    "Offer",
    "Order",
    "PlatformWalletInfo",
    "Terms",
    "User",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: NFT_MARKETPLACE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const signature = (getState() as RootState).backend.authSignature;
      headers.set("authorization", `Bearer ${signature}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Assets
    getAssets: builder.query<Asset[], Partial<BackendAssetQueryParams>>({
      query: (queryParams) => ({
        url: `asset/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: AllAssetsResponse, meta, arg) => response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Asset[] } = await queryFulfilled;
        dispatch(updateAssets(assetAryToAssets(data)));
      },
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Asset" as const, id })), "Asset"]
          : ["Asset"],
    }),
    getAsset: builder.query<Asset, string | undefined>({
      query: (id) => ({
        url: `asset/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Asset } = await queryFulfilled;
        dispatch(updateAsset(data));
      },
      providesTags: ["Asset"],
    }),
    deleteAsset: builder.mutation<Asset, Partial<Asset> & Pick<Asset, "id">>({
      query: ({ id, ...asset }) => {
        return {
          url: `asset/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: "Asset", id: arg.id }],
    }),
    validateNFT: builder.query<boolean, string | undefined>({
      query: (id) => ({
        url: `nft/validate-nft/${id}`,
      }),
      providesTags: ["Asset"],
    }),
    // Collections
    getCollections: builder.query<Collection[], Partial<BackendCollectionQuery>>({
      query: (queryParams) => ({
        url: `collection/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Collection[] }, meta, arg) =>
        response.data,
      providesTags: (result, error, queryParams) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Collection" as const, id })),
              "Collection",
            ]
          : ["Collection"],
    }),
    // Listings
    getListings: builder.query<Listing[], Partial<ListingQueryParam>>({
      query: (queryParams) => ({
        url: `asset-listing/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: AllListingsResponse, meta, arg) =>
        response.data.map((listing: Listing) => {
          const { term, ...formattedListing } = listing;
          return { ...formattedListing, term: term } as Listing;
        }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Listing[] } = await queryFulfilled;
        const assets = data.map((listing: Listing) => listing.asset);
        dispatch(updateListings(listingAryToListings(data)));
        dispatch(updateAssetsFromListings(assetAryToAssets(assets))); // could this potentially update with old listing data?
      },
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Listing" as const, id })), "Listing"]
          : ["Listing"],
    }),
    getListing: builder.query<Listing, string | undefined>({
      query: (id) => ({
        url: `asset-listing/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Listing } = await queryFulfilled;
        if (data && data.id) {
          dispatch(updateListing(data));
        }
      },
      providesTags: (result, error, queryParams) => [
        { type: "Listing" as const, id: result?.id || "" },
      ],
    }),
    createListing: builder.mutation<CreateListingRequest, Partial<CreateListingRequest>>({
      query: (body) => {
        return {
          url: `asset-listing`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Listing", "Asset", "Terms"],
    }),
    deleteListing: builder.mutation<Listing, Partial<Listing> & Pick<Listing, "id">>({
      query: ({ id }) => {
        return {
          url: `asset-listing/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Listing", "Asset", "Terms"],
    }),
    updateListing: builder.mutation<Listing, Partial<Listing> & Pick<Listing, "id">>({
      query: ({ id, ...patch }) => ({
        url: `asset-listing/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Listing } = await queryFulfilled;
        if (data && data.id) {
          dispatch(updateListing(data));
        }
      },
      transformResponse: (response: Listing, meta, arg) => response,
      invalidatesTags: ["Terms", "Listing", "Offer"],
    }),
    // Terms
    getTerms: builder.query<Terms[], Partial<BackendStandardQuery>>({
      query: (queryParams) => ({
        url: `term/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Terms[] }, meta, arg) =>
        response.data,
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Terms" as const, id })), "Terms"]
          : ["Terms"],
    }),
    updateTerms: builder.mutation<Terms, Partial<Terms> & Pick<Terms, "id">>({
      query: ({ id, ...patch }) => ({
        url: `term/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Terms, meta, arg) => response,
      invalidatesTags: ["Terms", "Listing", "Offer"],
    }),
    deleteTerms: builder.mutation<Terms, Partial<Terms> & Pick<Terms, "id">>({
      query: ({ id, ...terms }) => {
        return {
          url: `term/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Listing", "Terms", "Offer"],
    }),
    // Loans
    getLoans: builder.query<Loan[], Partial<BackendLoanQueryParams>>({
      query: (queryParams) => ({
        url: `loan/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Loan[] }, meta, arg) =>
        response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Loan[] } = await queryFulfilled;
        const assetListings = data.map((loan: Loan) => loan.assetListing);
        const assets = data.map((loan: Loan) => loan.assetListing.asset);
        dispatch(updateListings(listingAryToListings(assetListings)));
        dispatch(updateAssetsFromListings(assetAryToAssets(assets))); // could this potentially update with old listing data?
      },
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Loan" as const, id })), "Loan"]
          : ["Loan"],
    }),
    getLoan: builder.query<Loan, string | undefined>({
      query: (id) => ({
        url: `loan/${id}`,
      }),
      providesTags: (result, error, queryParams) => [
        { type: "Loan" as const, id: result?.id || "" },
      ],
    }),
    createLoan: builder.mutation<Loan, Loan>({
      query: ({ id, borrower, lender, assetListing, term, ...loan }) => {
        const { collection, ...asset } = dropHelperDates({ ...assetListing.asset }); // backend doesn't like collection
        const loanRequest = {
          ...loan,
          assetListing: {
            ...dropHelperDates({ ...assetListing }),
            asset: dropHelperDates({ ...asset }),
            term: dropHelperDates({ ...assetListing.term }),
          },
          borrower: dropHelperDates({ ...borrower }),
          lender: dropHelperDates({ ...lender }),
          term: dropHelperDates({ ...term }),
        };
        return {
          url: `loan`,
          method: "POST",
          body: loanRequest,
        };
      },
      invalidatesTags: ["Terms"],
    }),
    updateLoan: builder.mutation<Loan, Partial<Loan> & Pick<Loan, "id">>({
      query: ({ id, ...patch }) => ({
        url: `loan/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Loan, meta, arg) => response,
      invalidatesTags: ["Listing", "Offer", "Loan", "Asset"],
    }),
    deleteLoan: builder.mutation<Loan, Partial<Loan> & Pick<Loan, "id">>({
      query: ({ id, ...loan }) => {
        return {
          url: `loan/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Loan", "Asset", "Listing", "Terms"],
    }),
    resetPartialLoan: builder.mutation<Loan, string | undefined>({
      query: (id) => ({
        url: `loan/reset-status/${id}`,
      }),
      invalidatesTags: (result, error, queryParams) => [
        { type: "Loan" as const, id: result?.id || "" },
      ],
    }),
    // Offers
    getOffers: builder.query<Offer[], Partial<BackendOfferQueryParams>>({
      query: (queryParams) => ({
        url: `offer/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Offer[] }, meta, arg) =>
        response.data,
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Offer" as const, id })), "Offer"]
          : ["Offer"],
    }),
    getOffer: builder.query<Offer, string | undefined>({
      query: (id) => ({
        url: `offer/${id}`,
      }),
      providesTags: (result, error, queryParams) => [
        { type: "Offer" as const, id: result?.id || "" },
      ],
    }),
    createOffer: builder.mutation<Offer, Partial<Offer>>({
      query: (body) => {
        return {
          url: `offer`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Offer"],
    }),
    updateOffer: builder.mutation<Offer, Partial<Offer> & Pick<Offer, "id">>({
      query: ({ id, ...patch }) => ({
        url: `offer/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Offer, meta, arg) => response,
      invalidatesTags: ["Terms", "Listing", "Offer"],
    }),
    deleteOffer: builder.mutation<Offer, Partial<Offer> & Pick<Offer, "id">>({
      query: ({ id, ...offer }) => {
        return {
          url: `offer/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Asset", "Listing", "Terms", "Offer"],
    }),
    // User Notifications
    getUserNotifications: builder.query<
      Notification[],
      Partial<BackendNotificationQueryParams>
    >({
      query: (queryParams) => ({
        url: `user-notification/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Notification[] }, meta, arg) =>
        response.data.sort(notificationDateOldestFirst),
      providesTags: (result, error, queryParams) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Notification" as const, id })),
              "Notification",
            ]
          : ["Notification"],
    }),
    updateUserNotification: builder.mutation<
      Notification,
      Partial<Notification> & Pick<Notification, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `user-notification/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Notification, meta, arg) => response,
      invalidatesTags: ["Notification"],
    }),
    // User
    getUser: builder.query<User, string | undefined>({
      query: (walletAddress) => ({
        url: `user/all`,
        params: { walletAddress },
      }),
      providesTags: ["User"],
    }),
    // Wallet
    getWallet: builder.query<PlatformWalletInfo, string | undefined>({
      query: (walletAddress) => ({
        url: `wallet/${walletAddress}`,
      }),
      providesTags: ["PlatformWalletInfo"],
    }),
    // User
    getNftPrice: builder.query<NftPrice, { collection: string; tokenId: string }>({
      query: ({ collection, tokenId }) => ({
        url: `nft/price/${collection}/${tokenId}`,
        params: { collection, tokenId },
      }),
      providesTags: ["Asset"],
    }),
  }),
});

export const {
  useGetAssetQuery,
  useGetAssetsQuery,
  useGetCollectionsQuery,
  useDeleteAssetMutation,
  useValidateNFTQuery,
  useGetListingsQuery,
  useGetListingQuery,
  useDeleteListingMutation,
  useUpdateListingMutation,
  useGetLoansQuery,
  useGetLoanQuery,
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useDeleteLoanMutation,
  useResetPartialLoanMutation,
  useCreateListingMutation,
  useGetTermsQuery,
  useUpdateTermsMutation,
  useDeleteTermsMutation,
  useGetOffersQuery,
  useGetOfferQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useGetWalletQuery,
  useGetUserNotificationsQuery,
  useGetUserQuery,
  useUpdateUserNotificationMutation,
  useGetNftPriceQuery,
} = backendApi;
