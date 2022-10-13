import { useMediaQuery } from "@material-ui/core";
import { Box } from "@mui/material";

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
            src={latestAsset.imageUrl || ""}
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
      {latestAsset.mediaType === CollectibleMediaType.Image && latestAsset.imageUrl && (
        <img
          className={style["assetImg"]}
          src={latestAsset.imageUrl || ""}
          alt={latestAsset.name || ""}
          style={{
            height: "100%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
      {latestAsset.mediaType === CollectibleMediaType.Audio && latestAsset.videoUrl && (
        <Box sx={{ width: "100%", background: "#dfdada" }}>
          <img src={latestAsset.imageUrl || ""} alt={latestAsset.name || "unknown"} />
          <audio controls src={latestAsset.videoUrl} className={style["audio"]} />
        </Box>
      )}
      {latestAsset.mediaType === CollectibleMediaType.Html && latestAsset.videoUrl && (
        <iframe
          title={latestAsset?.name || ""}
          src={latestAsset.videoUrl}
          className={style["iframe"]}
        />
      )}
    </Box>
  );
};

export default PreviewImage;
