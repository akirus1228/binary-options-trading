import { useMediaQuery } from "@material-ui/core";
import { Box } from "@mui/material";

import { useBestImage } from "../../../hooks/use-best-image";
import { Asset, CollectibleMediaType } from "../../../types/backend-types";
import style from "./preview-image.module.scss";

export interface PreviewImageProps {
  asset: Asset;
}

export const PreviewImage = (props: PreviewImageProps): JSX.Element => {
  const isTablet = useMediaQuery("(min-width:576px)");
  const imageUrl = useBestImage(props?.asset, 1024);

  return (
    <Box
      sx={{
        height: "300px",
        width: "300px",
        borderRadius: isTablet ? "28px" : "14px",
        overflow: "hidden",
      }}
    >
      {props?.asset.mediaType === CollectibleMediaType.Video && props?.asset.videoUrl ? (
        <video controls autoPlay loop>
          <source src={props?.asset.videoUrl} />
        </video>
      ) : (
        <img
          className={style["assetImg"]}
          src={imageUrl || ""}
          alt={props.asset?.name || ""}
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
