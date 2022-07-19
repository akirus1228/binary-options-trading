import {
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Skeleton,
  SxProps,
  Theme,
  Typography,
  Link,
  Popover,
  IconButton,
} from "@mui/material";
import { useWeb3Context, chains, NetworkIds } from "@fantohm/shared-web3";
import { useSelector } from "react-redux";
import { useGetLoansQuery } from "../../api/backend-api";
import { useWalletAsset } from "../../hooks/use-wallet-asset";
import { RootState } from "../../store";
import { Listing } from "../../types/backend-types";
import AssetOwnerTag from "../asset-owner-tag/asset-owner-tag";
import HeaderBlurryImage from "../header-blurry-image/header-blurry-image";
import QuickStatus from "./quick-status/quick-status";
import StatusInfo from "./status-info/status-info";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import style from "./asset-details.module.scss";
import { useState } from "react";
import grayArrowRightUp from "../../../assets/icons/gray-arrow-right-up.svg";
import etherScan from "../../../assets/icons/etherscan.svg";
import openSea from "../../../assets/icons/opensea-icon.svg";

export interface AssetDetailsProps {
  contractAddress: string;
  tokenId: string;
  listing?: Listing;
  sx?: SxProps<Theme>;
}

export const AssetDetails = ({
  contractAddress,
  tokenId,
  listing,
  sx,
}: AssetDetailsProps): JSX.Element => {
  const { chainId } = useWeb3Context();
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const asset = useWalletAsset(contractAddress, tokenId);
  const [flagMoreDropDown, setFlagMoreDropDown] = useState<null | HTMLElement>(null);
  const { data: loan } = useGetLoansQuery(
    {
      skip: 0,
      take: 1,
      assetId: asset !== null ? asset.id : "",
    },
    {
      skip: !asset || false || !asset.id || !listing || !authSignature,
    }
  );

  const openMoreDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagMoreDropDown(event.currentTarget);
  };

  const viewLinks = [
    {
      startIcon: etherScan,
      alt: "EtherScan",
      title: "View on Etherscan",
      url: `${
        chains[chainId || 1].blockExplorerUrls[0]
      }token/${contractAddress}?a=${tokenId}`,
      endIcon: grayArrowRightUp,
    },
    {
      startIcon: openSea,
      alt: "OpenSea",
      title: "View on OpenSea",
      url: `${
        chainId === NetworkIds.Ethereum
          ? "https://opensea.io/assets/ethereum/"
          : "https://testnets.opensea.io/assets/rinkeby/"
      }${contractAddress}/${tokenId}`,
      endIcon: grayArrowRightUp,
    },
  ];

  return (
    <Container sx={sx}>
      <HeaderBlurryImage url={asset?.imageUrl} height={"355px"} />
      {asset && asset.imageUrl ? (
        <Grid container columnSpacing={5}>
          <Grid item xs={12} md={6}>
            <Box className={style["imgContainer"]}>
              <img src={asset.imageUrl} alt={asset.name || "unknown"} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography>{asset.collection?.name || ""}</Typography>
              <Box sx={{ display: "flex", my: "20px", alignItems: "center" }}>
                <Box>
                  <h1 style={{ margin: "0" }}>{asset.name}</h1>
                </Box>
                <IconButton
                  sx={{
                    position: "relative",
                    left: "20px",
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
                  {viewLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.url}
                      style={{ textDecoration: "none" }}
                      target="_blank"
                      onClick={() => setFlagMoreDropDown(null)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: "10px",
                        }}
                      >
                        <Box sx={{ display: "flex" }}>
                          <img
                            src={link.startIcon}
                            style={{ width: "24px", marginRight: "15px" }}
                            alt={link.alt}
                          />
                          <Typography variant="h6" style={{ fontWeight: "normal" }}>
                            {link.title}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: "15px", mt: "5px" }}>
                          <img
                            src={link.endIcon}
                            style={{ width: "20px" }}
                            alt={link.alt}
                          />
                        </Box>
                      </Box>
                    </Link>
                  ))}
                </Popover>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                minWidth: "50%",
                pb: "3em",
              }}
            >
              <Chip label={asset.status || "Unlisted"} className="dark" />
              <Typography sx={{ mx: "10px" }}>.</Typography>
              <Chip label={asset.mediaType || "Art"} className="light" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", mb: "3em" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#FFF",
                  borderRadius: "30px",
                  py: "1em",
                  width: "100%",
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <AssetOwnerTag asset={asset} />
                  </Box>
                  <QuickStatus listing={listing} />
                </Paper>
              </Box>
            </Box>
            {!!listing && (
              <StatusInfo
                asset={asset}
                listing={listing}
                loan={loan ? loan[0] : undefined}
              />
            )}
          </Grid>
        </Grid>
      ) : (
        <Skeleton variant="rectangular"></Skeleton>
      )}
    </Container>
  );
};

export default AssetDetails;
