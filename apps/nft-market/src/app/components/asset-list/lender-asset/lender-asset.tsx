import {
  Box,
  Chip,
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PreviewImage from "../preview-image/preview-image";
import { useEffect, useMemo, useState } from "react";
import { capitalizeFirstLetter } from "@fantohm/shared-helpers";
import { Asset, AssetStatus } from "../../../types/backend-types";
import { AppDispatch, RootState } from "../../../store";
import { selectListingFromAsset } from "../../../store/selectors/listing-selectors";
import { useDispatch, useSelector } from "react-redux";
import { useTermDetails } from "../../../hooks/use-term-details";
import { chains, formatCurrency, NetworkIds, useWeb3Context } from "@fantohm/shared-web3";
import { loadCurrencyFromAddress } from "../../../store/reducers/currency-slice";
import { selectCurrencyByAddress } from "../../../store/selectors/currency-selectors";
import style from "./lender-asset.module.scss";
import search from "../../../../assets/icons/search.svg";
import etherScan from "../../../../assets/icons/etherscan.svg";
import grayArrowRightUp from "../../../../assets/icons/gray-arrow-right-up.svg";
import openSea from "../../../../assets/icons/opensea-icon.svg";
import previewNotAvailable from "../../../../assets/images/preview-not-available.png";
import loadingGradient from "../../../../assets/images/loading.png";
import axios, { AxiosResponse } from "axios";

export type LenderAssetProps = {
  asset: Asset;
};

export function LenderAsset({ asset }: LenderAssetProps) {
  const { chainId } = useWeb3Context();
  const dispatch: AppDispatch = useDispatch();
  const listing = useSelector((state: RootState) => selectListingFromAsset(state, asset));
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, listing?.term?.currencyAddress || "")
  );
  const [flagMoreDropDown, setFlagMoreDropDown] = useState<null | HTMLElement>(null);
  const themeType = useSelector((state: RootState) => state.theme.mode);

  const [validImage, setValidImage] = useState(loadingGradient);

  const { repaymentAmount } = useTermDetails(listing?.term);
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

  useEffect(() => {
    if (asset.thumbUrl) {
      console.log("validating thumb: " + asset.thumbUrl);
      axios.head(asset.thumbUrl).then(validateImage);
    } else if (asset.imageUrl) {
      console.log("validating full image: " + asset.imageUrl);
      axios.head(asset.imageUrl).then(validateImage);
    } else if (asset.frameUrl) {
      console.log("validating frame image: " + asset.frameUrl);
      axios.head(asset.frameUrl).then(validateImage);
    } else {
      setValidImage(previewNotAvailable);
    }
  }, [asset]);

  const validateImage = (result: AxiosResponse<any, any>) => {
    if (
      result.status === 200 &&
      result.headers["content-type"].toLowerCase().includes("image")
    ) {
      setValidImage(result.config.url || "");
    }
  };

  const openMoreDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagMoreDropDown(event.currentTarget);
  };

  const viewLinks = [
    {
      startIcon: search,
      alt: "Search",
      title: "View Listing",
      url: `/asset/${asset.assetContractAddress}/${asset.tokenId}`,
      endIcon: null,
      isSelfTab: true,
    },
    {
      startIcon: etherScan,
      alt: "EtherScan",
      title: "View on Etherscan",
      url: `${chains[chainId || 1].blockExplorerUrls[0]}token/${
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
        chainId === NetworkIds.Ethereum
          ? "https://opensea.io/assets/ethereum/"
          : "https://testnets.opensea.io/assets/rinkeby/"
      }${asset.assetContractAddress}/${asset.tokenId}`,
      endIcon: grayArrowRightUp,
      isSelfTab: false,
    },
  ];

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(listing?.term?.currencyAddress));
  }, [listing]);

  if (asset === null || !asset || !listing) {
    return <h3>Loading...</h3>;
  }

  return (
    <Paper
      style={{
        borderRadius: "28px",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        position: "relative",
      }}
      className={style["assetBox"]}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          width: "100%",
          zIndex: 10,
          mt: "20px",
          px: "10px",
        }}
      >
        <Chip
          label={capitalizeFirstLetter(asset?.status.toLowerCase()) || "Unlisted"}
          className={chipColor}
        />
        <IconButton
          sx={{
            position: "relative",
            zIndex: 10,
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
        >
          {viewLinks.map((link, index) => (
            <Link
              key={link.title}
              href={link.url}
              style={{ textDecoration: "none" }}
              target={`${link.isSelfTab ? "_self" : "_blank"}`}
              onClick={(e) => {
                setFlagMoreDropDown(null);
              }}
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
      <RouterLink
        to={`/asset/${asset.assetContractAddress}/${asset.tokenId}`}
        className="flex"
        style={{ flexGrow: "1" }}
      >
        {asset.openseaId && (
          <PreviewImage
            url={validImage || previewNotAvailable}
            name={asset.name || "placeholder name"}
            contractAddress={asset.assetContractAddress}
            tokenId={asset.tokenId}
          />
        )}
      </RouterLink>
      <Box className={style["assetSpecs"]}>
        <Box className="flex fr fj-sb ai-c w100" style={{ margin: "15px 0 0 0" }}>
          <span
            style={{ color: "rgba(255,255,255,0.7)" }}
            className={style["termHeading"]}
          >
            Duration
          </span>
          <span
            style={{ color: "rgba(255,255,255,0.7)" }}
            className={style["termHeading"]}
          >
            APY
          </span>
        </Box>
        <Box className="flex fr fj-sb ai-c w100">
          <span className={style["termValue"]}>{listing.term.duration} days</span>
          <span className={style["termValue"]}>{listing.term.apr}%</span>
        </Box>
      </Box>
      <Box
        className="flex fc fj-fs ai-c"
        sx={{
          margin: {
            xs: "10px 0 0 0",
          },
        }}
      >
        {asset.collection && asset.collection.name && (
          <Box sx={{ position: "absolute" }}>
            <span
              style={{
                fontWeight: "400",
                fontSize: "15px",
                position: "relative",
                top: "-12px",
                background: "#FFF",
                borderRadius: "2em",
                padding: "0.1em",
                width: "80%",
                alignSelf: "center",
                textAlign: "center",
                opacity: "0.90",
              }}
            >
              {asset.collection.name}
            </span>
          </Box>
        )}
        <Box
          className="flex fc fj-c ai-c w100"
          sx={{
            p: {
              xs: "20px",
              sm: "20px",
              md: "20px",
              lg: "20px",
              xl: "30px",
            },
          }}
        >
          <Box
            className="flex fr fj-sb w100"
            sx={{
              alignItems: "top",
              flexFlow: {
                xs: "wrap",
              },
            }}
          >
            <Box
              sx={{
                width: "50%",
                flexFlow: "wrap",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <span style={{ color: "rgba(0,0,0,0.7)" }} className={style["loanHeading"]}>
                Loan amount
              </span>
              <Tooltip title={currency?.name || ""}>
                <img
                  className={style["loanIcon"]}
                  src={currency?.icon}
                  alt={currency?.name}
                  style={{
                    marginRight: "5px",
                    height: "22px",
                    width: "22px",
                    transform: "translateY(3px)",
                  }}
                />
              </Tooltip>
              <Tooltip
                title={formatCurrency(listing.term.amount * currency?.lastPrice, 2)}
              >
                <span className={style["assetPrice"]}>{listing.term.amount}</span>
              </Tooltip>
            </Box>
            <Box
              className={style["interestElem"]}
              sx={{
                width: "50%",
                flexFlow: "wrap",
              }}
            >
              <span style={{ color: "rgba(0,0,0,0.7)" }} className={style["loanHeading"]}>
                Interest
              </span>
              <Tooltip title={formatCurrency(repaymentAmount * currency?.lastPrice, 2)}>
                <span className={style["assetPriceStable"]}>
                  <img
                    src={currency?.icon}
                    alt={currency?.name}
                    style={{
                      marginRight: "5px",
                      height: "22px",
                      width: "22px",
                      transform: "translateY(3px)",
                    }}
                  />
                  {repaymentAmount.toFixed(2)}
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default LenderAsset;
