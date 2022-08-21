import { assetToCollectible, Collectible } from "@fantohm/shared/fetch-nft";
import { OpenseaAsset } from "../api/opensea";
import { ReservoirToken } from "../api/reservoir";
import { Assets, assetToAssetId } from "../store/reducers/asset-slice";
import { Listings } from "../store/reducers/listing-slice";
import {
  Asset,
  AssetStatus,
  Chain,
  CollectibleMediaType,
  CreateListingRequest,
  Listing,
  ListingStatus,
  StandardBackendObject,
  Terms,
} from "../types/backend-types";

// convert asset data from opensea to our internal type
export const openseaAssetToAsset = async (
  openseaAsset: OpenseaAsset[]
): Promise<Asset[]> => {
  const collectibles = await Promise.all(
    openseaAsset.map(async (asset) => await assetToCollectible(asset))
  );
  // convertCollectible to Asset
  const walletContents = collectibles.map((collectible: Collectible): Asset => {
    const { id, ...tmpCollectible } = collectible;
    const asset = {
      ...tmpCollectible,
      openseaLoaded: Date.now() + 300 * 1000,
      status: AssetStatus.New,
      osData: openseaAsset.find(
        (asset: OpenseaAsset) =>
          asset.asset_contract?.address === collectible.assetContractAddress &&
          asset.token_id === collectible.tokenId
      ),
    } as Asset;
    return asset;
  });

  return walletContents;
};

export const reservoirTokenToAsset = (token: ReservoirToken): Asset => {
  const updatedAsset = {
    status: AssetStatus.New,
    tokenId: token.tokenId.toString(),
    name: token.name || null,
    description: token.description || null,
    mediaType: CollectibleMediaType.Image,
    frameUrl: null,
    imageUrl: token.image || null,
    gifUrl: null,
    videoUrl: token.media || null,
    threeDUrl: null,
    thumbUrl: "",
    isOwned: !!token.owner,
    owner: { address: token.owner },
    dateCreated: null,
    dateLastTransferred: null,
    externalLink: token.image || null,
    permaLink: null,
    assetContractAddress: token.contract || "",
    chain: "eth" as Chain,
    wallet: token.owner,
    reservoirData: token,
    collection: {
      name: token.collection.name || "",
      image_url: token.collection.image || "",
      slug: token.collection.slug || "",
    },
  };
  return updatedAsset;
};

// convert Asset[] to Assets
export const assetAryToAssets = (assetAry: Asset[]): Assets => {
  const assets: Assets = {};
  assetAry.forEach((asset: Asset) => {
    assets[assetToAssetId(asset)] = asset;
  });
  return assets;
};

// convert Listing[] to Listings
export const listingAryToListings = (listingAry: Listing[]): Listings => {
  const listings: Listings = {};
  listingAry.forEach((listing: Listing) => {
    listings[listing.id || ""] = listing;
  });
  return listings;
};

export const dropHelperDates = <T extends StandardBackendObject>(obj: T): T => {
  if (obj.updatedAt) obj.updatedAt = undefined;
  if (obj.createdAt) obj.createdAt = undefined;
  return obj;
};

export const listingToCreateListingRequest = (
  asset: Asset,
  term: Terms
): CreateListingRequest => {
  // convert term to term
  const tempListing: CreateListingRequest = {
    asset: asset,
    term: term,
    status: ListingStatus.Listed,
  };
  // if the asset isn't in the database we need to pass the asset without the ID
  // if the asset is in the database we need to pass just the ID
  if (
    typeof tempListing.asset !== "string" &&
    tempListing.asset.status === AssetStatus.New
  ) {
    delete tempListing.asset.id;
    tempListing.asset.status = AssetStatus.Listed;
  }

  return tempListing;
};
