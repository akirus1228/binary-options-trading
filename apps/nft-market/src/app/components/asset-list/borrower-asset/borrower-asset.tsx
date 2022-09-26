import {
  Box,
  Chip,
  IconButton,
  Paper,
  Popover,
  Typography,
  Link,
  Tooltip,
} from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Link as RouterLink } from "react-router-dom";

import style from "./borrower-asset.module.scss";
import PreviewImage from "../preview-image/preview-image";
import { Asset, AssetStatus } from "../../../types/backend-types";
import { useMemo, useState } from "react";
import { isDev } from "@fantohm/shared-web3";
import search from "../../../../assets/icons/search.svg";
import searchDark from "../../../../assets/icons/search-dark.svg";
import etherScan from "../../../../assets/icons/etherscan.svg";
import etherScanDark from "../../../../assets/icons/etherscan-dark.svg";
import grayArrowRightUp from "../../../../assets/icons/gray-arrow-right-up.svg";
import openSea from "../../../../assets/icons/opensea-icon.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useBestImage } from "../../../hooks/use-best-image";
import { useMediaQuery } from "@material-ui/core";

export interface BorrowerAssetProps {
  asset: Asset;
}

export const BorrowerAsset = ({ asset }: BorrowerAssetProps): JSX.Element => {
  // const asset = useWalletAsset(props.contractAddress, props.tokenId);
  const [flagMoreDropDown, setFlagMoreDropDown] = useState<null | HTMLElement>(null);
  const themeType = useSelector((state: RootState) => state.theme.mode);
  const imageUrl = useBestImage(asset, 1024);
  const isTablet = useMediaQuery("(min-width:576px)");

  const chipColor = useMemo(() => {
    if (!asset) return;
    switch (asset.status) {
      case AssetStatus.New:
      case AssetStatus.Ready:
        return "grey";
      case AssetStatus.Listed:
        return "blue";
      case AssetStatus.Locked:
        return "dark";
      default:
        return;
    }
  }, [asset]);

  const openMoreDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagMoreDropDown(event.currentTarget);
  };

  const viewLinks = [
    ...(asset.usable === false
      ? []
      : [
          {
            startIcon: themeType === "dark" ? searchDark : search,
            alt: "Search",
            title: "View Listing",
            url: `/asset/${asset.assetContractAddress}/${asset.tokenId}`,
            endIcon: null,
            isSelfTab: true,
          },
        ]),
    {
      startIcon: themeType === "dark" ? etherScanDark : etherScan,
      alt: "EtherScan",
      title: "View on Etherscan",
      url: `https://${isDev ? "rinkeby." : ""}etherscan.io/token/${
        asset?.assetContractAddress
      }?a=${asset?.tokenId}`,
      endIcon: grayArrowRightUp,
      isSelfTab: false,
    },
    {
      startIcon: openSea,
      alt: "OpenSea",
      title: "View on OpenSea",
      url: `${
        !isDev
          ? "https://opensea.io/assets/ethereum/"
          : "https://testnets.opensea.io/assets/rinkeby/"
      }${asset.assetContractAddress}/${asset.tokenId}`,
      endIcon: grayArrowRightUp,
      isSelfTab: false,
    },
  ];

  const statusText = useMemo(() => {
    if (!asset) return;
    if (asset.usable === false) {
      return "Unusable";
    }
    switch (asset.status) {
      case AssetStatus.New:
      case AssetStatus.Ready:
        return "Unlisted";
      case AssetStatus.Listed:
        return "Listed";
      case AssetStatus.Locked:
        return "Escrow";
      default:
        return;
    }
  }, [asset]);

  if (asset === null) {
    return <h3>Loading...</h3>;
  }

  return (
    <Tooltip
      arrow
      PopperProps={{
        sx: {
          marginTop: "-150px !important",
        },
      }}
      title={
        asset.usable === false
          ? "Not verified collection, Ask for whitelisting on discord"
          : ""
      }
    >
      <Paper
        style={{
          borderRadius: isTablet ? "28px" : "14px",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          position: "relative",
          opacity: asset.usable === false ? "0.5" : undefined,
        }}
        className={style["assetBox"]}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: isTablet ? "space-between" : "center",
            position: "absolute",
            width: "100%",
            zIndex: 10,
            mt: isTablet ? "20px" : "0px",
            paddingLeft: isTablet ? "10px" : 0,
            paddingRight: isTablet ? "10px" : 0,
          }}
        >
          <Chip label={statusText || "Unlisted"} className={`nft-status ${chipColor}`} />
          <IconButton
            sx={{
              position: isTablet ? "relative" : "absolute",
              zIndex: 10,
              right: isTablet ? "0" : "-4px",
              top: isTablet ? "0" : "-8px",
            }}
            className={style["moreButton"]}
            aria-haspopup="true"
            aria-expanded={flagMoreDropDown ? "true" : undefined}
            onClick={openMoreDropDown}
          >
            <MoreHorizOutlinedIcon />
          </IconButton>
          <Popover
            id="moreDropDown"
            open={Boolean(flagMoreDropDown)}
            anchorEl={flagMoreDropDown}
            onClose={() => setFlagMoreDropDown(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            disableScrollLock={true}
          >
            {viewLinks.map((link, index) => (
              <Link
                key={link.title}
                href={link.url}
                style={{ textDecoration: "none" }}
                target={`${link.isSelfTab ? "_self" : "_blank"}`}
                onClick={() => setFlagMoreDropDown(null)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: `${index === viewLinks.length - 1 ? "0" : "15px"}`,
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <img
                      src={link.startIcon}
                      style={{ width: "20px", marginRight: "10px" }}
                      alt={link.alt}
                    />
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: "normal",
                        fontSize: "1em",
                        maxWidth: "80%",
                        color: `${themeType === "light" ? "black" : "white"}`,
                      }}
                    >
                      {link.title}
                    </Typography>
                  </Box>
                  {link?.endIcon && (
                    <Box sx={{ ml: "7px", mt: "-2px" }}>
                      <img src={link.endIcon} style={{ width: "9px" }} alt={link.alt} />
                    </Box>
                  )}
                </Box>
              </Link>
            ))}
          </Popover>
        </Box>
        {asset.tokenId &&
          (asset.usable === false ? (
            <span className={style["assetImage"]}>
              <PreviewImage
                url={imageUrl}
                name={asset.name || "placeholder name"}
                contractAddress={asset.assetContractAddress}
                tokenId={asset.tokenId}
              />
            </span>
          ) : (
            <RouterLink
              to={`/asset/${asset.assetContractAddress}/${asset.tokenId}`}
              className={style["assetImage"]}
            >
              <PreviewImage
                url={imageUrl}
                name={asset.name || "placeholder name"}
                contractAddress={asset.assetContractAddress}
                tokenId={asset.tokenId}
              />
            </RouterLink>
          ))}
        <Box className="flex fc fj-c ai-c">
          {asset.collection && asset.collection.name && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                textAlign: "center",
                width: "100%",
              }}
            >
              <span className={style["collectionName"]}>{asset.collection.name}</span>
            </Box>
          )}
          <span
            style={{
              fontWeight: "700",
              fontSize: isTablet ? "20px" : "14px",
              margin: "2em 0",
              textAlign: "center",
              paddingLeft: "5%",
              paddingRight: "5%",
            }}
          >
            {asset.name || "#" + asset.tokenId}
          </span>
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default BorrowerAsset;
