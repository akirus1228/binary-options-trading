import { useMediaQuery } from "@material-ui/core";
import { Box } from "@mui/material";
import style from "./preview-image.module.scss";

export interface PreviewImageProps {
  url: string;
  name: string;
  contractAddress: string;
  tokenId: string;
}

export const PreviewImage = (props: PreviewImageProps): JSX.Element => {
  const isTablet = useMediaQuery("(min-width:576px)");

  return (
    <Box
      sx={{
        height: "300px",
        width: "300px",
        borderRadius: isTablet ? "28px" : "14px",
        overflow: "hidden",
      }}
    >
      <img
        className={style["assetImg"]}
        src={props.url}
        alt={props.name}
        style={{
          height: "100%",
          width: "auto",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </Box>
  );
};

export default PreviewImage;
