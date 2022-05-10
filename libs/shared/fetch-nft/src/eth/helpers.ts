import { OpenSeaAssetExtended, OpenSeaEvent, OpenSeaEventExtended } from "./types";
import { Collectible, CollectibleMediaType } from "../utils/types";

/**
 * extensions based on OpenSea metadata standards
 * https://docs.opensea.io/docs/metadata-standards
 */
const OPENSEA_AUDIO_EXTENSIONS = ["mp3", "wav", "oga"];
const OPENSEA_VIDEO_EXTENSIONS = [
  "gltf",
  "glb",
  "webm",
  "mp4",
  "m4v",
  "ogv",
  "ogg",
  "mov",
];

const SUPPORTED_VIDEO_EXTENSIONS = ["webm", "mp4", "ogv", "ogg", "mov"];
const SUPPORTED_3D_EXTENSIONS = ["gltf", "glb"];

const NON_IMAGE_EXTENSIONS = [...OPENSEA_VIDEO_EXTENSIONS, ...OPENSEA_AUDIO_EXTENSIONS];

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

const isAssetImage = (asset: OpenSeaAssetExtended) => {
  return [
    asset.image_url,
    asset.image_original_url,
    asset.image_preview_url,
    asset.image_thumbnail_url,
  ].some((url) => url && NON_IMAGE_EXTENSIONS.every((ext) => !url.endsWith(ext)));
};

const areUrlExtensionsSupportedForType = (
  asset: OpenSeaAssetExtended,
  extensions: string[]
) => {
  const {
    animation_url,
    animation_original_url,
    image_url,
    image_original_url,
    image_preview_url,
    image_thumbnail_url,
  } = asset;
  return [
    animation_url || "",
    animation_original_url || "",
    image_url,
    image_original_url,
    image_preview_url,
    image_thumbnail_url,
  ].some((url) => url && extensions.some((ext) => url.endsWith(ext)));
};

const isAssetVideo = (asset: OpenSeaAssetExtended) => {
  return areUrlExtensionsSupportedForType(asset, SUPPORTED_VIDEO_EXTENSIONS);
};

const isAssetThreeDAndIncludesImage = (asset: OpenSeaAssetExtended) => {
  return (
    areUrlExtensionsSupportedForType(asset, SUPPORTED_3D_EXTENSIONS) &&
    isAssetImage(asset)
  );
};

const isAssetGif = (asset: OpenSeaAssetExtended) => {
  return !!(
    asset.image_url?.endsWith(".gif") ||
    asset.image_original_url?.endsWith(".gif") ||
    asset.image_preview_url?.endsWith(".gif") ||
    asset.image_thumbnail_url?.endsWith(".gif")
  );
};

export const isAssetValid = (asset: OpenSeaAssetExtended) => {
  return (
    isAssetGif(asset) ||
    isAssetThreeDAndIncludesImage(asset) ||
    isAssetVideo(asset) ||
    isAssetImage(asset)
  );
};

/**
 * Returns a collectible given an asset object from the OpenSea API
 *
 * A lot of the work here is to determine whether a collectible is a gif, a video, or an image
 *
 * If the collectible is a gif, we set the gifUrl, and we process a frame from the gifUrl which we set as its frameUrl
 *
 * If the collectible is a video, we set the videoUrl, and we check whether the asset has an image
 * - if it has an image, we check whether the image url is an actual image or a video (sometimes OpenSea returns
 *   videos in the image url properties of the asset)
 *   - if it's an image, we set it as the frameUrl
 *   - otherwise, we unset the frameUrl
 * - if not, we do not set the frameUrl
 * Video collectibles that do not have a frameUrl will use the video paused at the first frame as the thumbnail
 * in the collectibles tab
 *
 * Otherwise, we consider the collectible to be an image, we get the image url and make sure that it is not
 * a gif or a video
 * - if it's a gif, we follow the above gif logic
 * - if it's a video, we unset the frameUrl and follow the above video logic
 * - otherwise, we set the frameUrl and the imageUrl
 *
 * @param asset
 */
export const assetToCollectible = async (
  asset: OpenSeaAssetExtended
): Promise<Collectible> => {
  let mediaType: CollectibleMediaType;
  let frameUrl = null;
  let imageUrl = null;
  let videoUrl = null;
  let threeDUrl = null;
  let gifUrl = null;

  const { animation_url, animation_original_url } = asset;
  const imageUrls = [
    asset.image_url,
    asset.image_original_url,
    asset.image_preview_url,
    asset.image_thumbnail_url,
  ];

  try {
    if (isAssetGif(asset)) {
      mediaType = "GIF";
      // frame url for the gif is computed later in the collectibles page
      frameUrl = null;
      gifUrl = imageUrls.find((url) => url?.endsWith(".gif"))!;
    } else if (isAssetThreeDAndIncludesImage(asset)) {
      mediaType = "THREE_D";
      threeDUrl = [animation_url, animation_original_url, ...imageUrls].find(
        (url) => url && SUPPORTED_3D_EXTENSIONS.some((ext) => url.endsWith(ext))
      )!;
      frameUrl = imageUrls.find(
        (url) => url && NON_IMAGE_EXTENSIONS.every((ext) => !url.endsWith(ext))
      )!;
      // image urls may not end in known extensions
      // just because the don't end with the NON_IMAGE_EXTENSIONS above does not mean they are images
      // they may be gifs
      // example: https://lh3.googleusercontent.com/rOopRU-wH9mqMurfvJ2INLIGBKTtF8BN_XC7KZxTh8PPHt5STSNJ-i8EQit8ZTwE3Mi8LK4on_4YazdC3Cl-HdaxbnKJ23P8kocvJHQ
      const res = await fetch(frameUrl, { method: "HEAD" });
      const hasGifFrame = res.headers.get("Content-Type")?.includes("gif");
      if (hasGifFrame) {
        gifUrl = frameUrl;
        // frame url for the gif is computed later in the collectibles page
        frameUrl = null;
      }
    } else if (isAssetVideo(asset)) {
      mediaType = "VIDEO";
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
      )!;
    } else {
      mediaType = "IMAGE";
      frameUrl = imageUrls.find((url) => !!url)!;
      const res = await fetch(frameUrl, { method: "HEAD" });
      const isGif = res.headers.get("Content-Type")?.includes("gif");
      const isVideo = res.headers.get("Content-Type")?.includes("video");
      if (isGif) {
        mediaType = "GIF";
        gifUrl = frameUrl;
        // frame url for the gif is computed later in the collectibles page
        frameUrl = null;
      } else if (isVideo) {
        mediaType = "VIDEO";
        frameUrl = null;
        videoUrl = imageUrls.find((url) => !!url)!;
      } else {
        imageUrl = imageUrls.find((url) => !!url)!;
      }
    }
  } catch (e) {
    console.error("Error processing collectible", e);
    mediaType = "IMAGE";
    frameUrl = imageUrls.find((url) => !!url)!;
    imageUrl = frameUrl;
  }

  return {
    id: `${asset.token_id}:::${asset.asset_contract?.address ?? ""}`,
    openseaId: asset.id.toString(),
    tokenId: asset.token_id,
    name: (asset.name || asset?.asset_contract?.name) ?? "",
    description: asset.description,
    mediaType,
    frameUrl,
    imageUrl,
    videoUrl,
    threeDUrl,
    gifUrl,
    isOwned: true,
    dateCreated: null,
    dateLastTransferred: null,
    externalLink: asset.external_link,
    permaLink: asset.permalink,
    assetContractAddress: asset.asset_contract?.address ?? null,
    chain: "eth",
    wallet: asset.wallet,
  };
};

export const creationEventToCollectible = async (
  event: OpenSeaEventExtended
): Promise<Collectible> => {
  const { asset, created_date } = event;

  const collectible = await assetToCollectible(asset);

  return {
    ...collectible,
    dateCreated: created_date,
    isOwned: false,
  };
};

export const transferEventToCollectible = async (
  event: OpenSeaEventExtended,
  isOwned = true
): Promise<Collectible> => {
  const { asset, created_date } = event;

  const collectible = await assetToCollectible(asset);

  return {
    ...collectible,
    isOwned,
    dateLastTransferred: created_date,
  };
};

export const isFromNullAddress = (event: OpenSeaEvent) => {
  return event.from_account.address === NULL_ADDRESS;
};
