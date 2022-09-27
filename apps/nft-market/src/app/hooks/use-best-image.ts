import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Asset } from "../types/backend-types";
import loadingGradientLight from "../../assets/images/loading-light.png";
import loadingGradientDark from "../../assets/images/loading-dark.png";
import previewNotAvailableLight from "../../assets/images/preview-not-available-light.png";
import previewNotAvailableDark from "../../assets/images/preview-not-available-dark.png";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { NFT_MARKETPLACE_API_URL } from "../api/backend-api";

export type ImageConvertResponse = {
  message?: string;
  error?: string;
  magic_url?: string;
  dir?: string;
};

const NFT_MARKETPLACE_IMAGE_PROXY_ENDPOINT = NFT_MARKETPLACE_API_URL + "/nft/image?url=";

const getHeaders = async (url: string): Promise<any | void> => {
  try {
    const response: AxiosResponse = await axios.head(url);
    if (response.status === 200) {
      return response;
    }
  } catch (e) {
    try {
      const response: AxiosResponse = await axios.head(
        NFT_MARKETPLACE_IMAGE_PROXY_ENDPOINT + url
      );
      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      return null;
    }
  }
};

const sortImageBySize = (imageA: AxiosResponse, imageB: AxiosResponse) => {
  const sizeA = imageA.headers["content-length"];
  const sizeB = imageB.headers["content-length"];
  if (sizeA && sizeB) {
    return parseInt(sizeB) - parseInt(sizeA);
  }
  return 0;
};

const getGucUrl = (img_url: string): Promise<string> => {
  return axios
    .get<ImageConvertResponse>(
      `https://image-manager-363021.uk.r.appspot.com/?url=${img_url}`
    )
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data.magic_url;
      }
      return;
    })
    .catch((e: AxiosError) => {
      console.log(e);
    });
};

export const useBestImage = (asset: Asset | null, preferredWidth: number) => {
  const themeType = useSelector((state: RootState) => state.theme.mode);
  const loadingGradient =
    themeType === "dark" ? loadingGradientDark : loadingGradientLight;
  const [url, setUrl] = useState(loadingGradient);

  const loadImages: string[] = useMemo(() => {
    if (asset === null) return [];
    const imageSet = new Set<string>(); // use set to enforce uniqueness
    if (asset.thumbUrl) {
      imageSet.add(asset.thumbUrl);
    } else if (asset.imageUrl) {
      imageSet.add(asset.imageUrl);
    } else if (asset.frameUrl) {
      imageSet.add(asset.frameUrl);
    }
    return [...imageSet].filter((item) => !!item);
  }, [asset?.osData?.image_url, asset?.thumbUrl, asset?.imageUrl, asset?.frameUrl]);

  useEffect(() => {
    let isSubscribed = true;
    // do any of the images contain googleusercontent?
    // if so this is what we want to use
    if (!loadImages.length) {
      if (isSubscribed) {
        setUrl("");
      }
      return;
    }

    const googleImage = loadImages.find((imageString) =>
      imageString?.includes("googleusercontent")
    );
    if (googleImage) {
      if (isSubscribed) {
        setUrl(`${googleImage.split("=")[0]}=w${preferredWidth}`);
      }
      return;
    }

    const base64Image = loadImages.find((imageString) =>
      imageString?.includes("data:image")
    );
    if (base64Image) {
      if (isSubscribed) {
        setUrl(base64Image);
      }
      return;
    }

    const liqdIpfsImage = loadImages.find((imageString) =>
      imageString?.includes("https://balance.mypinata.cloud/ipfs")
    );
    if (liqdIpfsImage) {
      if (isSubscribed) {
        setUrl(liqdIpfsImage);
      }
      return;
    }

    // no google user content, check the image headers to make sure they're valid links
    Promise.all(loadImages.map((url) => getHeaders(url))).then((imageDetail) => {
      if (!imageDetail || (imageDetail && !imageDetail.length)) {
        setUrl("");
        return;
      }
      const validImages: AxiosResponse[] = imageDetail.filter(
        (imageDetail) => !!imageDetail
      ) as AxiosResponse[];
      validImages.sort((imageA, imageB) => sortImageBySize(imageA, imageB));
      if (isSubscribed) {
        if (validImages.length < 1) {
          setUrl("");
        } else {
          if (preferredWidth < 1024) {
            const response = validImages[0];
            if (response.headers["content-type"] === "image/svg+xml") {
              setUrl(response.config.url ?? "");
            } else {
              getGucUrl(
                response.config.url?.replace(NFT_MARKETPLACE_IMAGE_PROXY_ENDPOINT, "") ??
                  ""
              ).then((gucUrl) => {
                setUrl(`${gucUrl}=s${preferredWidth}` ?? loadingGradient);
              });
            }
          } else {
            const response = validImages[validImages.length - 1];
            if (response.headers["content-type"] === "image/svg+xml") {
              setUrl(response.config.url ?? "");
            } else {
              getGucUrl(
                response.config.url?.replace(NFT_MARKETPLACE_IMAGE_PROXY_ENDPOINT, "") ??
                  ""
              ).then((gucUrl) => {
                setUrl(`${gucUrl}=s${preferredWidth}` ?? loadingGradient);
              });
            }
          }
        }
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, [loadImages]);

  return (
    url ||
    asset?.gifUrl ||
    (themeType === "dark" ? previewNotAvailableDark : previewNotAvailableLight)
  );
};
