import { useMediaQuery } from "@material-ui/core";
import { Box } from "@mui/material";

import { Asset, CollectibleMediaType } from "../../../types/backend-types";
import style from "./preview-image.module.scss";

export interface PreviewImageProps {
  asset: Asset;
}

export const PreviewImage = (props: PreviewImageProps): JSX.Element => {
  const isTablet = useMediaQuery("(min-width:576px)");
  const { asset } = props;
  return (
    <Box
      sx={{
        height: isTablet ? "300px" : "130px",
        width: "300px",
        borderRadius: isTablet ? "28px" : "14px",
        overflow: "hidden",
      }}
    >
      {asset.mediaType === CollectibleMediaType.Video && asset.videoUrl && (
        <video controls autoPlay loop>
          <source src={asset.videoUrl} />
        </video>
      )}
      {asset.mediaType === CollectibleMediaType.Gif && asset.gifUrl && (
        <img
          className={style["assetImg"]}
          src={asset.gifUrl || ""}
          alt={props.asset?.name || ""}
          style={{
            height: "100%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
      {asset.mediaType === CollectibleMediaType.ThreeD && asset.threeDUrl && (
        <img
          className={style["assetImg"]}
          src={asset.threeDUrl || ""}
          alt={props.asset?.name || ""}
          style={{
            height: "100%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
      {asset.mediaType === CollectibleMediaType.Image && asset.imageUrl && (
        <img
          className={style["assetImg"]}
          src={asset.imageUrl || ""}
          alt={props.asset?.name || ""}
          style={{
            height: "100%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
      {asset.mediaType === CollectibleMediaType.Audio && asset.videoUrl && (
        <Box sx={{ width: "100%", background: "#dfdada" }}>
          <img src={asset.imageUrl || ""} alt={asset.name || "unknown"} />
          <audio
            controls
            src={asset.videoUrl}
            autoPlay={true}
            className={style["audio"]}
          />
        </Box>
      )}
      {asset.mediaType === CollectibleMediaType.Html && asset.videoUrl && (
        <iframe title={asset?.name} src={asset.videoUrl} className={style["iframe"]} />
      )}
    </Box>
  );
};

export default PreviewImage;
