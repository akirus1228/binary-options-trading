import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  Asset,
  AssetStatus,
  BackendAssetQueryParams,
  StandardAssetLookupParams,
} from "../../types/backend-types";

const selectAssets = (state: RootState) => state.assets.assets;

const selectAssetId = (state: RootState, id: string) => id;
export const selectAssetById = createSelector(
  selectAssets,
  selectAssetId,
  (assets, backendAssetId) => {
    const match: [string, Asset] | undefined = Object.entries(assets).find(
      ([assetId, asset]) => asset.id === backendAssetId
    );
    if (match) {
      return match[1];
    } else {
      return {} as Asset;
    }
  }
  //(assets, assetId) => assets.filter((asset: Asset) => asset.id === assetId)
);

const selectAssetAddress = (state: RootState, addressParams: StandardAssetLookupParams) =>
  addressParams;
export const selectAssetByAddress = createSelector(
  selectAssets,
  selectAssetAddress,
  (assets, addressParams) =>
    assets[`${addressParams.tokenId}:::${addressParams.contractAddress}`]
);

const selectAssetMine = (state: RootState, address: string) => address;
export const selectMyAssets = createSelector(
  selectAssets,
  selectAssetMine,
  (assets, address) => {
    const matches: [string, Asset][] = Object.entries(assets).filter(
      ([assetId, asset]) => asset.owner?.address.toLowerCase() === address.toLowerCase()
    );
    return matches.map((assetMap: [string, Asset]) => assetMap[1]);
  }
  //(assets, assetId) => assets.filter((asset: Asset) => asset.id === assetId)
);
export const selectAssetsQuery = (state: RootState, query: BackendAssetQueryParams) =>
  query;
export const selectAssetsByQuery = createSelector(
  selectAssets,
  selectAssetsQuery,
  (assets, query) => {
    const matches: [string, Asset][] = Object.entries(assets).filter(
      ([assetId, asset]) => {
        // for each asset, loop over the query and check if there's anything that doesnt match
        let openseaIds: string[];
        if (query.openseaIds) {
          openseaIds = query.openseaIds;
        } else {
          openseaIds = [];
        }
        const entries = Object.entries(query).map(([key, matchValue]) => {
          console.log(`key ${key}`);
          console.log(`asset[key as keyof Asset] ${asset[key as keyof Asset]}`);
          // does the value of this query parameter match the value of the asset for this field?
          if (["skip", "take"].includes(key)) return true; // skip and take should be ignored
          if (key === "openseaIds")
            // look in the list of opensea id's for a match
            return openseaIds.includes(asset?.openseaId || "");
          if (key === "status" && matchValue === AssetStatus.Ready)
            return [AssetStatus.Ready, AssetStatus.New].includes(asset.status);
          if (asset[key as keyof Asset] !== matchValue) return false;
          return true;
        });
        console.log(entries);
        //. if  there are any false entries in the array, fail this asset for the filter
        return !entries.includes(false);
      }
    );
    return matches.map((assetMap: [string, Asset]) => assetMap[1]);
  }
  //(assets, assetId) => assets.filter((asset: Asset) => asset.id === assetId)
);
