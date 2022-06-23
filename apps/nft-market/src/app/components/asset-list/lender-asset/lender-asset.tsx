import { Box, Chip, IconButton, Paper, Tooltip } from "@mui/material";
import { useWalletAsset } from "../../../hooks/use-wallet-asset";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PreviewImage from "../preview-image/preview-image";
// import style from "./lender-asset.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { capitalizeFirstLetter } from "@fantohm/shared-helpers";
import { AssetStatus } from "../../../types/backend-types";
import { AppDispatch, RootState } from "../../../store";
import { selectListingFromAsset } from "../../../store/selectors/listing-selectors";
import { useDispatch, useSelector } from "react-redux";
import { useTermDetails } from "../../../hooks/use-term-details";
import { formatCurrency } from "@fantohm/shared-web3";
import { loadCurrencyFromAddress } from "../../../store/reducers/currency-slice";
import { selectCurrencyByAddress } from "../../../store/selectors/currency-selectors";
import style from "./lender-asset.module.scss";


export interface LenderAssetProps {
  contractAddress: string;
  tokenId: string;
}

export function LenderAsset(props: LenderAssetProps) {
  const dispatch: AppDispatch = useDispatch();
  const asset = useWalletAsset(props.contractAddress, props.tokenId);
  const listing = useSelector((state: RootState) => selectListingFromAsset(state, asset));
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, listing?.term?.currencyAddress || "")
  );
  const { repaymentAmount } = useTermDetails(listing.term);
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
    dispatch(loadCurrencyFromAddress(listing.term.currencyAddress));
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
        position: "relative"
      }}
      className={style["assetBox"]}
    >
      <Box sx={{ position: "absolute" }}>
        <Chip
          sx={{
            position: "relative",
            top: "15px",
            left: "20px",
            zIndex: 10,
          }}
          label={capitalizeFirstLetter(asset?.status.toLowerCase()) || "Unlisted"}
          className={chipColor}
        />
      </Box>
      <Box sx={{ position: "absolute", right: "20px" }}>
        <IconButton
          sx={{
            position: "relative",
            top: "10px",
            zIndex: 10,
          }}
          className={style["moreButton"]}
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
      </Box>
      {asset.imageUrl && asset.openseaId && (
        <Link to={`/asset/${props.contractAddress}/${props.tokenId}`}>
          <PreviewImage
            url={asset.imageUrl}
            name={asset.name || "placeholder name"}
            contractAddress={asset.assetContractAddress}
            tokenId={asset.tokenId}
          />
        </Link>
      )}
      <Box className="flex fc fj-fs ai-c" sx={{
        margin: {
          xs: "10px 0 0 0"
        }
      }}>
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
        <Box className="flex fc fj-c ai-c w100" sx={{ 
          p: {
            xs: "1em",
            sm: "1.5em",
            md: "2em" 
          }
        }}>
          <Box className="flex fr fj-sb ai-c w100" sx={{
            flexFlow: {
              xs: "wrap"
            },
            margin: {
              xs: "0 0 10px 0"
            }
          }}>
            <Box className="flex fr ai-c" sx={{
              width: {
                xs: "100%",
                sm: "auto"
              }
            }}>
              <span className={style["assetPrice"]}>
                {listing.term.amount}
              </span>
              <Tooltip title={currency?.name || ""}>
                <img
                  src={currency?.icon}
                  alt={currency?.name}
                  style={{ marginLeft: "5px", height: "22px", width: "22px" }}
                />
              </Tooltip>
            </Box>
            <span
              style={{
                borderRadius: "1em",
                color: "#1b9385",
                backgroundColor: "#1b938517",
                padding: "0.25em 1em",
                fontWeight: "600",
              }}
              className={style["assetPriceStable"]}
            >
              {repaymentAmount.toFixed(4)} {currency?.symbol}
            </span>
          </Box>
          <Box className="flex fr fj-sb ai-c w100">
            <span style={{ fontWeight: "400", fontSize: "12px", color: "#8991A2" }}>
              ~{formatCurrency(listing.term.amount * currency?.lastPrice, 2)}
            </span>
            <span
              style={{
                borderRadius: "1em",
                color: "#1b9385",
                backgroundColor: "#1b938517",
                padding: "0.25em 1em",
                fontWeight: "600",
              }}
              className={style["assetPriceStableFiat"]}
            >
              ~{formatCurrency(repaymentAmount * currency?.lastPrice, 2)}
            </span>
          </Box>
          <Box className="flex fr fj-sb ai-c w100" style={{margin: "15px 0 0 0"}}>
            <span style={{ color: "#8991A2" }} className={style["termHeading"]}>Duration</span>
            <span style={{ color: "#8991A2" }} className={style["termHeading"]}>APY</span>
          </Box>
          <Box className="flex fr fj-sb ai-c w100">
            <span className={style["termValue"]}>{listing.term.duration} days</span>
            <span className={style["termValue"]}>{listing.term.apr}%</span>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default LenderAsset;
