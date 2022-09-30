import { useMediaQuery } from "@material-ui/core";
import { Box } from "@mui/material";

import { useBestImage } from "../../../hooks/use-best-image";
import { Asset, CollectibleMediaType } from "../../../types/backend-types";
import style from "./preview-image.module.scss";

export interface PreviewImageProps {
  asset: Asset;
  metaDataResponse: Asset | undefined;
}

export const PreviewImage = (props: PreviewImageProps): JSX.Element => {
  const latestAsset =
    props.metaDataResponse !== undefined ? props.metaDataResponse : props.asset;
  const isTablet = useMediaQuery("(min-width:576px)");
  const imageUrl = useBestImage(latestAsset, 1024);

  return (
    <Box
      sx={{
        height: isTablet ? "300px" : "130px",
        width: "300px",
        borderRadius: isTablet ? "28px" : "14px",
        overflow: "hidden",
      }}
    >
      {latestAsset.mediaType !== CollectibleMediaType.Image &&
        (latestAsset.gifUrl ||
          latestAsset.imageUrl ||
          latestAsset.frameUrl ||
          latestAsset.thumbUrl) && (
          <img
            className={style["assetImg"]}
            src={imageUrl || ""}
            alt={latestAsset?.name || ""}
            style={{
              height: "100%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        )}
      {latestAsset.mediaType !== CollectibleMediaType.Image &&
        !(
          latestAsset.gifUrl ||
          latestAsset.imageUrl ||
          latestAsset.frameUrl ||
          latestAsset.thumbUrl
        ) &&
        latestAsset.videoUrl && (
          <video controls loop>
            <source src={latestAsset.videoUrl} />
          </video>
        )}
      {latestAsset.mediaType === CollectibleMediaType.Image && imageUrl && (
        <img
          className={style["assetImg"]}
          src={imageUrl || ""}
          alt={latestAsset.name || ""}
          style={{
            height: "100%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
    </Box>
  );
};

export default PreviewImage;
