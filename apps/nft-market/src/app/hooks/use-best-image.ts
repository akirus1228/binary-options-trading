import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Asset } from "../types/backend-types";
import loadingGradient from "../../assets/images/loading.png";
import previewNotAvailable from "../../assets/images/preview-not-available.png";

export const getIpfsUrl = (url: string | null = "") => {
  if (!url?.includes("ipfs")) return url || "";

  const IPFS_URL = "https://ipfs.io/";

  if (!url) {
    return url;
  }

  const [, item] = url.split("ipfs/");

  if (item) {
    return IPFS_URL + "ipfs/" + item;
  }

  return url;
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

const validateImage = (url: string, timeout = 5000): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = "";
      reject(false);
    }, timeout);

    img.onerror = img.onabort = () => {
      clearTimeout(timer);
      reject(false);
    };

    img.onload = () => {
      clearTimeout(timer);
      resolve(url);
    };
    img.src = url;
  });
};

export const useBestImage = (asset: Asset | null, preferredWidth: number) => {
  const [url, setUrl] = useState(loadingGradient);

  const imageLoadOrder: string[] = useMemo(() => {
    if (asset === null) return [];
    const imageSet = new Set<string>(); // use set to enforce uniqueness
    if (asset.osData?.image_url) imageSet.add(asset.osData?.image_url);
    if (asset.thumbUrl) imageSet.add(asset.thumbUrl);
    if (asset.imageUrl) imageSet.add(asset.imageUrl);
    if (asset.frameUrl) imageSet.add(asset.frameUrl);
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
          setUrl(
            (preferredWidth < 1024
              ? validImages[0].config.url
              : validImages[validImages.length - 1].config.url) || loadingGradient
          );
        }
      }
      return () => {
        isSubscribed = false;
      };
    });
  }, [imageLoadOrder]);

  return (
    url ||
    getIpfsUrl(asset?.gifUrl) ||
    getIpfsUrl(asset?.threeDUrl) ||
    getIpfsUrl(asset?.videoUrl) ||
    previewNotAvailable
  );
};
