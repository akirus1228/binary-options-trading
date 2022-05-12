import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  Asset,
  Listing,
  ListingStatus,
  StandardAssetLookupParams,
} from "../../types/backend-types";
import { Listings, ListingState } from "../reducers/listing-slice";

const selectListings = (state: RootState) => state.listings.listings;

const selectListingAsset = (state: RootState, asset: Asset) => asset;
export const selectListingFromAsset = createSelector(
  selectListings,
  selectListingAsset,
  (listings, asset) => {
    const key = Object.keys(listings).find((key: string) => {
      const rtn =
        listings[key].asset.assetContractAddress === asset.assetContractAddress &&
        listings[key].asset.tokenId === asset.tokenId;
      return rtn;
    });

    if (key) {
      return listings[key];
    } else {
      return {} as Listing;
    }
  }
);

const selectListingAddress = (
  state: RootState,
  addressParams: StandardAssetLookupParams
) => addressParams;
export const selectListingByAddress = createSelector(
  selectListings,
  selectListingAddress,
  (listings, addressParams) => {
    const key = Object.keys(listings).find((key: string) => {
      const rtn =
        listings[key].asset.assetContractAddress === addressParams.contractAddress &&
        listings[key].asset.tokenId === addressParams.tokenId;
      return rtn;
    });

    if (key) {
      return listings[key];
    } else {
      return {} as Listing;
    }
  }
);

const selectListingStatus = (state: RootState, status: ListingStatus) => status;
export const selectListingByStatus = createSelector(
  selectListings,
  selectListingStatus,
  (listings: Listings, status: ListingStatus): Listing[] => {
    const matches: [string, Listing][] = Object.entries(listings).filter(
      ([listingId, listing]) => listing.status === status
    );
    return matches.map(([listingId, listing]) => listing);
  }
);

const selectListingId = (state: RootState, listingId: string) => listingId;
export const selectListingById = createSelector(
  selectListings,
  selectListingId,
  (listings, listingId) => listings[listingId]
);