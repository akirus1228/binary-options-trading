import {
  MetaplexNFT,
  MetaplexNFTPropertiesFile,
  SolanaNFT,
  SolanaNFTType,
  StarAtlasNFT,
} from "./types";
import { Nullable } from "../utils/typeUtils";
import { Collectible, CollectibleMediaType } from "../utils/types";

type SolanaNFTMedia = {
  collectibleMediaType: CollectibleMediaType;
  url: string;
  frameUrl: Nullable<string>;
};

/**
 * NFT is a gif if it has a file with MIME type image/gif
 * if it's a gif, we compute an image frame from the gif
 */
const nftGif = async (nft: MetaplexNFT): Promise<Nullable<SolanaNFTMedia>> => {
  const gifFile = (nft.properties?.files ?? []).find(
    (file) => typeof file === "object" && file.type === "image/gif"
  );
  if (gifFile) {
    const url = (gifFile as MetaplexNFTPropertiesFile).uri;
    return {
      collectibleMediaType: "GIF",
      url,
      frameUrl: null,
    };
  }
  return null;
};

/**
 * NFT is a 3D object if:
 * - its category is vr, or
 * - it has an animation url that ends in glb, or
 * - it has a file whose type is glb, or
 *
 * if the 3D has a poster/thumbnail, it would be:
 * - either in the image property, or
 * - the properties files with a type of image
 */
const nftThreeDWithFrame = async (
  nft: MetaplexNFT
): Promise<Nullable<SolanaNFTMedia>> => {
  const files = nft.properties?.files ?? [];
  const objFile = files.find(
    (file: any) => typeof file === "object" && file.type.includes("glb")
  ) as MetaplexNFTPropertiesFile;
  const objUrl = files.find(
    (file: any) => typeof file === "string" && file.endsWith("glb")
  ) as string;
  const is3DObject =
    nft.properties?.category === "vr" ||
    nft.animation_url?.endsWith("glb") ||
    objFile ||
    objUrl;
  if (is3DObject) {
    let frameUrl;
    if (!nft.image.endsWith("glb")) {
      frameUrl = nft.image;
    } else {
      const imageFile = files?.find(
        (file) => typeof file === "object" && file.type.includes("image")
      ) as MetaplexNFTPropertiesFile;
      if (imageFile) {
        frameUrl = imageFile.uri;
      }
    }
    if (frameUrl) {
      let url: string;
      if (nft.animation_url && nft.animation_url.endsWith("glb")) {
        url = nft.animation_url;
      } else if (objFile) {
        url = objFile.uri;
      } else if (objUrl) {
        url = objUrl;
      } else {
        return null;
      }
      return {
        collectibleMediaType: "THREE_D",
        url,
        frameUrl,
      };
    }
  }
  return null;
};

/**
 * NFT is a video if:
 * - its category is video, or
 * - it has an animation url that does not end in glb, or
 * - it has a file whose type is video, or
 * - it has a file whose url includes watch.videodelivery.net
 *
 * if the video has a poster/thumbnail, it would be in the image property
 * otherwise, we later use the first video frame as the thumbnail
 */
const nftVideo = async (nft: MetaplexNFT): Promise<Nullable<SolanaNFTMedia>> => {
  const files = nft.properties?.files ?? [];
  // In case we want to restrict to specific file extensions, see below link
  // https://github.com/metaplex-foundation/metaplex/blob/81023eb3e52c31b605e1dcf2eb1e7425153600cd/js/packages/web/src/views/artCreate/index.tsx#L318
  const videoFile = files.find(
    (file) =>
      typeof file === "object" &&
      file.type.includes("video") &&
      !file.type.endsWith("glb")
  ) as MetaplexNFTPropertiesFile;
  const videoUrl = files.find(
    (file) =>
      typeof file === "string" &&
      // https://github.com/metaplex-foundation/metaplex/blob/397ceff70b3524aa0543540584c7200c79b198a0/js/packages/web/src/components/ArtContent/index.tsx#L107
      file.startsWith("https://watch.videodelivery.net/")
  ) as string;
  const isVideo =
    nft.properties?.category === "video" ||
    (nft.animation_url && !nft.animation_url.endsWith("glb")) ||
    videoFile ||
    videoUrl;
  if (isVideo) {
    let url: string;
    if (nft.animation_url && !nft.animation_url.endsWith("glb")) {
      url = nft.animation_url;
    } else if (videoFile) {
      url = videoFile.uri;
    } else if (videoUrl) {
      url = videoUrl;
    } else if (files.length) {
      // if there is only one file, then that's the video
      // otherwise, the second file is the video (the other files are image/audio files)
      // https://github.com/metaplex-foundation/metaplex/blob/397ceff70b3524aa0543540584c7200c79b198a0/js/packages/web/src/components/ArtContent/index.tsx#L103
      if (files.length === 1) {
        url = typeof files[0] === "object" ? files[0].uri : files[0];
      } else {
        url = typeof files[1] === "object" ? files[1].uri : files[1];
      }
    } else {
      return null;
    }
    return {
      collectibleMediaType: "VIDEO",
      url,
      frameUrl: nft.image || null,
    };
  }
  return null;
};

/**
 * NFT is an image if:
 * - its category is image, or
 * - it has a file whose type is image, or
 * - it has an image property
 */
const nftImage = async (nft: MetaplexNFT): Promise<Nullable<SolanaNFTMedia>> => {
  const files = nft.properties?.files ?? [];
  // In case we want to restrict to specific file extensions, see below link
  // https://github.com/metaplex-foundation/metaplex/blob/81023eb3e52c31b605e1dcf2eb1e7425153600cd/js/packages/web/src/views/artCreate/index.tsx#L316
  const imageFile = files.find(
    (file) => typeof file === "object" && file.type.includes("image")
  ) as MetaplexNFTPropertiesFile;
  const isImage = nft.properties?.category === "image" || nft.image.length || imageFile;
  if (isImage) {
    let url;
    if (nft.image.length) {
      url = nft.image;
    } else if (imageFile) {
      url = imageFile.uri;
    } else if (files.length) {
      if (files.length === 1) {
        url = typeof files[0] === "object" ? files[0].uri : files[0];
      } else {
        url = typeof files[1] === "object" ? files[1].uri : files[1];
      }
    } else {
      return null;
    }
    return {
      collectibleMediaType: "IMAGE",
      url,
      frameUrl: url,
    };
  }
  return null;
};

/**
 * If not easily discoverable tha nft is gif/video/image, we check whether it has files
 * if it does not, then we discard the nft
 * otherwise, we fetch the content type of the first file and check its MIME type:
 * - if gif, we also compute an image frame from it
 * - if video, we later use the first video frame as the thumbnail
 * - if image, the image url is also the frame url
 */
const nftComputedMedia = async (nft: MetaplexNFT): Promise<Nullable<SolanaNFTMedia>> => {
  const files = nft.properties?.files ?? [];
  if (!files.length) {
    return null;
  }

  const url = typeof files[0] === "object" ? files[0].uri : files[0];
  const headResponse = await fetch(url, { method: "HEAD" });
  const contentType = headResponse.headers.get("Content-Type");
  if (contentType?.includes("gif")) {
    // frame url for the gif is computed later in the collectibles page
    return {
      collectibleMediaType: "GIF",
      url,
      frameUrl: null,
    };
  }
  if (contentType?.includes("video")) {
    return {
      collectibleMediaType: "VIDEO",
      url,
      frameUrl: null,
    };
  }
  if (contentType?.includes("image")) {
    return {
      collectibleMediaType: "IMAGE",
      url,
      frameUrl: url,
    };
  }

  return null;
};

const metaplexNFTToCollectible = async (
  nft: MetaplexNFT,
  address: string
): Promise<Collectible> => {
  const identifier = [nft.symbol, nft.name, nft.image].filter(Boolean).join(":::");

  const collectible = {
    id: identifier,
    tokenId: identifier,
    name: nft.name,
    description: nft.description,
    externalLink: nft.external_url,
    isOwned: true,
    chain: "sol",
  } as Collectible;

  if ((nft.properties?.creators ?? []).some((creator) => creator.address === address)) {
    collectible.isOwned = false;
  }

  const { url, frameUrl, collectibleMediaType } = ((await nftGif(nft)) ||
    (await nftThreeDWithFrame(nft)) ||
    (await nftVideo(nft)) ||
    (await nftImage(nft)) ||
    (await nftComputedMedia(nft))) as SolanaNFTMedia;
  collectible.frameUrl = frameUrl;
  collectible.mediaType = collectibleMediaType;
  if (collectibleMediaType === "GIF") {
    collectible.gifUrl = url;
  } else if (collectibleMediaType === "THREE_D") {
    collectible.threeDUrl = url;
  } else if (collectibleMediaType === "VIDEO") {
    collectible.videoUrl = url;
  } else if (collectibleMediaType === "IMAGE") {
    collectible.imageUrl = url;
  }

  return collectible;
};

const starAtlasNFTToCollectible = async (nft: StarAtlasNFT): Promise<Collectible> => {
  const identifier = [nft._id, nft.symbol, nft.name, nft.image]
    .filter(Boolean)
    .join(":::");

  const collectible = {
    id: identifier,
    tokenId: nft._id,
    name: nft.name,
    description: nft.description,
    isOwned: true,
    chain: "sol",
  } as Collectible;

  // todo: check if there are gif or video nfts for star atlas
  const is3DObj = [nft.image, nft.media?.thumbnailUrl]
    .filter(Boolean)
    .some((item) => ["glb", "gltf"].some((extension) => item.endsWith(extension)));
  const hasImageFrame = [nft.image, nft.media?.thumbnailUrl]
    .filter(Boolean)
    .some((item) => ["glb", "gltf"].every((extension) => !item.endsWith(extension)));
  if (is3DObj && hasImageFrame) {
    collectible.mediaType = "THREE_D";
    collectible.threeDUrl = ["glb", "gltf"].some((extension) =>
      nft.image.endsWith(extension)
    )
      ? nft.image
      : nft.media?.thumbnailUrl;
    collectible.frameUrl = ["glb", "gltf"].every(
      (extension) => !nft.image.endsWith(extension)
    )
      ? nft.image
      : nft.media?.thumbnailUrl;
  } else {
    collectible.mediaType = "IMAGE";
    collectible.imageUrl = nft.image;
    collectible.frameUrl = nft.media?.thumbnailUrl?.length
      ? nft.media.thumbnailUrl
      : nft.image;
  }
  collectible.dateCreated = nft.createdAt;

  return collectible;
};

export const solanaNFTToCollectible = async (
  nft: SolanaNFT,
  address: string,
  type: SolanaNFTType
): Promise<Nullable<Collectible>> => {
  switch (type) {
    case "METAPLEX":
      return metaplexNFTToCollectible(nft as MetaplexNFT, address);
    case "STAR_ATLAS":
      return starAtlasNFTToCollectible(nft as StarAtlasNFT);
    default:
      return null;
  }
};
