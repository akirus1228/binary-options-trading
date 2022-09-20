import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Asset } from "../types/backend-types";
import loadingGradient from "../../assets/images/loading.png";
import previewNotAvailable from "../../assets/images/preview-not-available.png";

export const getIpfsUrl = (url: string | null = "") => {
  if (!url?.includes("ipfs")) return url || "";

  const IPFS_URL = "https://balance.mypinata.cloud/";

  if (!url) {
    return url;
  }

  const [, item] = url.split("ipfs/");

  if (item) {
    return IPFS_URL + "ipfs/" + item;
  }

  return url;
};

export type ImageConvertResponse = {
  message?: string;
  error?: string;
  magic_url?: string;
  dir?: string;
};

const getHeaders = (url: string): Promise<AxiosResponse | void> => {
  return axios
    .head(url)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response;
      }
      return;
    })
    .catch((e: AxiosError) => {
      console.log(e);
      console.log(url);
    });
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
      console.log(img_url);
    });
};

const ipfsToHttps = (ipfsUrl: string): string => {
  return ipfsUrl.replace("ipfs://", "https://balance.mypinata.cloud/ipfs/");
};

export const useBestImage = (asset: Asset | null, preferredWidth: number) => {
  const [url, setUrl] = useState(loadingGradient);

  const imageLoadOrder: string[] = useMemo(() => {
    if (asset === null) return [];
    const imageSet = new Set<string>(); // use set to enforce uniqueness
    console.log(asset);
    if (asset.thumbUrl)
      imageSet.add(
        ipfsToHttps(
          asset.thumbUrl.replace("opensea.mypinata.cloud", "balance.mypinata.cloud")
        )
      );
    if (asset.imageUrl)
      imageSet.add(
        ipfsToHttps(
          asset.imageUrl.replace("opensea.mypinata.cloud", "balance.mypinata.cloud")
        )
      );
    if (asset.frameUrl)
      imageSet.add(
        ipfsToHttps(
          asset.frameUrl.replace("opensea.mypinata.cloud", "balance.mypinata.cloud")
        )
      );
    console.log(imageSet);
    return [...imageSet]; // return array for simplicity of filtering and sorting
  }, [asset?.osData?.image_url, asset?.thumbUrl, asset?.imageUrl, asset?.frameUrl]);

  useEffect(() => {
    let isSubscribed = true;
    // do any of the images contain googleusercontent?
    // if so this is what we want to use
    const img = imageLoadOrder.find((imageString) =>
      imageString?.includes("googleusercontent")
    );
    if (img) {
      setUrl(`${img.split("=")[0]}=w${preferredWidth}`);
      return;
    }

    // don't worry about base64 encoded images, max size should be around 32kb.
    const base64Img = imageLoadOrder.find((imageString) =>
      imageString?.includes("data:image")
    );
    if (base64Img) {
      setUrl(base64Img);
      return;
    }

    // no googleusercontent, check the image headers to make sure they're valid links
    Promise.all(
      imageLoadOrder
        .filter((imageString) => !!imageString) // ignore empty strings
        .map((imageString) => getHeaders(imageString))
    ).then((imageDetails) => {
      const validImages: AxiosResponse[] = imageDetails.filter(
        (imageDetails) => !!imageDetails
      ) as AxiosResponse[];
      validImages.sort((imageA, imageB) => sortImageBySize(imageA, imageB));
      if (isSubscribed) {
        if (validImages.length < 1) {
          setUrl("");
        } else {
          if (preferredWidth < 1024) {
            if (validImages[0].headers["content-type"] === "image/svg+xml") {
              setUrl(validImages[0].config.url ?? "");
            } else {
              getGucUrl(validImages[0].config.url ?? "").then((gucUrl) => {
                setUrl(`${gucUrl}=s${preferredWidth}` ?? loadingGradient);
              });
            }
          } else {
            if (
              validImages[validImages.length - 1].headers["content-type"] ===
              "image/svg+xml"
            ) {
              setUrl(validImages[validImages.length - 1].config.url ?? "");
            } else {
              getGucUrl(validImages[validImages.length - 1].config.url ?? "").then(
                (gucUrl) => {
                  setUrl(`${gucUrl}=s${preferredWidth}` ?? loadingGradient);
                }
              );
            }
          }
        }
      }
      return () => {
        isSubscribed = false;
      };
    });
  }, [imageLoadOrder]);

  return url || getIpfsUrl(asset?.gifUrl) || previewNotAvailable;
};
