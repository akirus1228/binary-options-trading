import {
  assetToCollectible,
  Collectible,
  NON_IMAGE_EXTENSIONS,
  SUPPORTED_3D_EXTENSIONS,
  SUPPORTED_VIDEO_EXTENSIONS,
} from "@fantohm/shared/fetch-nft";
import { NftPortAsset } from "../api/nftport";
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
  Nullable,
  StandardBackendObject,
  Terms,
} from "../types/backend-types";

export const getIpfsUrl = (url?: Nullable<string>) => {
  const IPFS_URL = "https://ipfs.io/";

  if (url && url.startsWith("ipfs")) {
    return IPFS_URL + url.replaceAll("://", "/");
  }

  return url;
};

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

export const nftPortAssetToCollectible = async (
  asset: NftPortAsset
): Promise<Collectible> => {
  let mediaType: CollectibleMediaType;
  let frameUrl = null;
  let imageUrl = null;
  let videoUrl = null;
  let threeDUrl = null;
  let gifUrl = null;

  const animation_original_url = getIpfsUrl(asset.animation_url);
  const animation_url = getIpfsUrl(asset.cached_animation_url);
  const imageUrls = [
    getIpfsUrl(asset.file_url),
    getIpfsUrl(asset.cached_file_url),
    getIpfsUrl(asset.metadata.image),
  ];

  try {
    if (imageUrls.find((url) => url?.endsWith(".gif"))) {
      mediaType = CollectibleMediaType.Gif;
      // frame url for the gif is computed later in the collectibles page
      frameUrl = null;
      gifUrl = imageUrls.find((url) => url?.endsWith(".gif"));
    } else if (
      imageUrls.some(
        (url) => url && SUPPORTED_3D_EXTENSIONS.some((ext) => url.endsWith(ext))
      )
    ) {
      mediaType = CollectibleMediaType.ThreeD;
      threeDUrl = [animation_url, animation_original_url, ...imageUrls].find(
        (url) => url && SUPPORTED_3D_EXTENSIONS.some((ext) => url.endsWith(ext))
      );
      frameUrl = imageUrls.find(
        (url) => url && NON_IMAGE_EXTENSIONS.every((ext) => !url.endsWith(ext))
      );
      // image urls may not end in known extensions
      // just because the don't end with the NON_IMAGE_EXTENSIONS above does not mean they are images
      // they may be gifs
      // example: https://lh3.googleusercontent.com/rOopRU-wH9mqMurfvJ2INLIGBKTtF8BN_XC7KZxTh8PPHt5STSNJ-i8EQit8ZTwE3Mi8LK4on_4YazdC3Cl-HdaxbnKJ23P8kocvJHQ
      const res = await fetch(frameUrl || "", { method: "HEAD" });
      const hasGifFrame = res.headers.get("Content-Type")?.includes("gif");
      if (hasGifFrame) {
        gifUrl = frameUrl;
        // frame url for the gif is computed later in the collectibles page
        frameUrl = null;
      }
    } else if (
      imageUrls.some(
        (url) => url && SUPPORTED_VIDEO_EXTENSIONS.some((ext) => url.endsWith(ext))
      )
    ) {
      mediaType = CollectibleMediaType.Video;
      frameUrl =
        imageUrls.find(
          (url) => url && NON_IMAGE_EXTENSIONS.every((ext) => !url.endsWith(ext))
        ) ?? null;

      /**
       * make sure frame url is not a video or a gif
       * if it is, unset frame url so that component will use a video url frame instead
       */
      if (frameUrl) {
        const res = await fetch(frameUrl, { method: "HEAD" });
        const isVideo = res.headers.get("Content-Type")?.includes("video");
        const isGif = res.headers.get("Content-Type")?.includes("gif");
        if (isVideo || isGif) {
          frameUrl = null;
        }
      }

      videoUrl = [animation_url, animation_original_url, ...imageUrls].find(
        (url) => url && SUPPORTED_VIDEO_EXTENSIONS.some((ext) => url.endsWith(ext))
      );
    } else {
      mediaType = CollectibleMediaType.Image;
      frameUrl = imageUrls.find((url) => !!url);
      const res = await fetch(frameUrl || "", { method: "HEAD" });
      const isGif = res.headers.get("Content-Type")?.includes("gif");
      const isVideo = res.headers.get("Content-Type")?.includes("video");
      if (isGif) {
        mediaType = CollectibleMediaType.Gif;
        gifUrl = frameUrl;
        // frame url for the gif is computed later in the collectibles page
        frameUrl = null;
      } else if (isVideo) {
        mediaType = CollectibleMediaType.Video;
        frameUrl = null;
        videoUrl = imageUrls.find((url) => !!url);
      } else {
        imageUrl = imageUrls.find((url) => !!url);
      }
    }
  } catch (e) {
    console.error("Error processing collectible", e);
    mediaType = CollectibleMediaType.Image;
    frameUrl = imageUrls.find((url) => !!url);
    imageUrl = frameUrl;
  }

  return {
    id: `${asset.token_id}:::${asset.contract_address?.toLowerCase() ?? ""}`,
    tokenId: asset.token_id,
    name: (asset.name || asset?.contract?.name) ?? "",
    description: asset.description,
    mediaType,
    frameUrl: frameUrl || "",
    imageUrl: imageUrl || "",
    videoUrl: videoUrl || "",
    threeDUrl: threeDUrl || "",
    gifUrl: gifUrl || "",
    thumbUrl: "",
    isOwned: true,
    owner: { address: "" },
    dateCreated: null,
    dateLastTransferred: null,
    externalLink: "",
    permaLink: "",
    assetContractAddress: asset.contract_address ?? null,
    chain: "eth",
    wallet: "",
    collection: {
      ...asset.contract,
      safelist_request_status: "verified",
    },
  };
};

export const nftPortAssetsToAssets = async (
  nftPortAssets: NftPortAsset[]
): Promise<Asset[]> => {
  const collectibles = await Promise.all(
    nftPortAssets.map(async (asset) => await nftPortAssetToCollectible(asset))
  );
  // convertCollectible to Asset
  const walletContents = collectibles.map((collectible: Collectible): Asset => {
    const { id, ...tmpCollectible } = collectible;
    const asset = {
      ...tmpCollectible,
      openseaLoaded: Date.now() + 300 * 1000,
      status: AssetStatus.New,
      npData: nftPortAssets.find(
        (asset) =>
          asset.contract_address === collectible.assetContractAddress &&
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
      symbol: "",
      safelist_request_status: "verified",
      description: token.collection.description,
      thumbnail_url: "",
      cached_thumbnail_url: "",
      banner_url: token.collection.banner,
      cached_banner_url: token.collection.banner,
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
