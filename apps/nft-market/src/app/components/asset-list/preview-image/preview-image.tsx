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
  const { asset } = props;
  const imageUrl = useBestImage(asset, 1024);
  return (
    <Box
      sx={{
        height: isTablet ? "300px" : "130px",
        width: "300px",
        borderRadius: isTablet ? "28px" : "14px",
        overflow: "hidden",
      }}
    >
      {asset.mediaType !== CollectibleMediaType.Image &&
        (asset.gifUrl || asset.imageUrl || asset.frameUrl || asset.thumbUrl) && (
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
      {asset.mediaType !== CollectibleMediaType.Image &&
        !(asset.gifUrl || asset.imageUrl || asset.frameUrl || asset.thumbUrl) &&
        asset.videoUrl && (
          <video controls loop>
            <source src={asset.videoUrl} />
          </video>
        )}
      {asset.mediaType === CollectibleMediaType.Image && imageUrl && (
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
