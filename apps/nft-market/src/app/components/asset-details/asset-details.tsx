import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Link,
  Paper,
  Popover,
  Skeleton,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { isDev, useWeb3Context } from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCollectionsQuery,
  useGetLoansQuery,
  useGetNftPriceQuery,
  useResetPartialLoanMutation,
} from "../../api/backend-api";
import { useWalletAsset } from "../../hooks/use-wallet-asset";
import { AppDispatch, RootState } from "../../store";
import { AssetStatus, Listing, Loan, LoanStatus } from "../../types/backend-types";
import AssetOwnerTag from "../asset-owner-tag/asset-owner-tag";
import QuickStatus from "./quick-status/quick-status";
import StatusInfo from "./status-info/status-info";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import style from "./asset-details.module.scss";
import { useMemo, useState } from "react";
import grayArrowRightUp from "../../../assets/icons/gray-arrow-right-up.svg";
import etherScan from "../../../assets/icons/etherscan.svg";
import openSea from "../../../assets/icons/opensea-icon.svg";
import BlueChip from "../../../assets/icons/blue-chip.svg";
import PriceInfo from "./price-info/price-info";
import { useBestImage } from "../../hooks/use-best-image";
import { addAlert } from "../../store/reducers/app-slice";

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
  const dispatch: AppDispatch = useDispatch();
  const { address } = useWeb3Context();
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const asset = useWalletAsset(contractAddress, tokenId);
  const imageUrl = useBestImage(asset, Math.floor(window.innerWidth * 0.75));
  const [flagMoreDropDown, setFlagMoreDropDown] = useState<null | HTMLElement>(null);
  const { data: collections } = useGetCollectionsQuery({});
  const { data: nftPrices } = useGetNftPriceQuery({
    collection: contractAddress,
    tokenId,
  });
  const [isPending, setIsPending] = useState(false);
  const [resetPartialLoan, { isLoading: isResetting, reset: resetResetPartialLoan }] =
    useResetPartialLoanMutation();
  const { data: loans } = useGetLoansQuery(
    {
      skip: 0,
      take: 1,
      sortQuery: "loan.updatedAt:DESC",
      status: LoanStatus.Active,
      assetId: asset !== null ? asset.id : "",
    },
    {
      skip: !authSignature || !asset || !asset.id || asset.status !== AssetStatus.Locked,
    }
  );

  const activeLoan = useMemo(() => {
    return loans?.find((loan: Loan) => loan.status === LoanStatus.Active);
  }, [loans]);

  const isOwner = useMemo(() => {
    return address.toLowerCase() === asset?.owner?.address.toLowerCase();
  }, [asset, address]);

  const openMoreDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagMoreDropDown(event.currentTarget);
  };

  const viewLinks = [
    {
      startIcon: etherScan,
      alt: "EtherScan",
      title: "View on Etherscan",
      url: `https://${
        isDev ? "rinkeby." : ""
      }etherscan.io/token/${contractAddress}?a=${tokenId}`,
      endIcon: grayArrowRightUp,
    },
    {
      startIcon: openSea,
      alt: "OpenSea",
      title: "View on OpenSea",
      url: `${
        !isDev
          ? "https://opensea.io/assets/ethereum/"
          : "https://testnets.opensea.io/assets/rinkeby/"
      }${contractAddress}/${tokenId}`,
      endIcon: grayArrowRightUp,
    },
  ];

  const resetStatus = async () => {
    if (!activeLoan) {
      return;
    }
    setIsPending(true);
    resetPartialLoan(activeLoan.id).then(() => {
      setIsPending(false);
      resetResetPartialLoan();
      dispatch(addAlert({ message: "Locked has been cancelled." }));
    });
  };

  return (
    <Container sx={sx} className={style["assetRow"]}>
      {/* <HeaderBlurryImage url={asset?.imageUrl} height={"355px"} /> */}
      {asset && (asset.thumbUrl !== "" || asset.imageUrl !== "") ? (
        <Grid container columnSpacing={10} sx={{ alignItems: "center" }}>
          <Grid item xs={12} md={6}>
            <Box className={style["imgContainer"]}>
              <img src={imageUrl} alt={asset.name || "unknown"} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {collections
                ?.filter(
                  (collection) =>
                    collection.contractAddress === asset?.assetContractAddress
                )
                .map((collection, index) => (
                  <Typography
                    sx={{ color: "#374FFF", display: "flex" }}
                    key={`${collection.slug}_${index}`}
                  >
                    {collection.slug}
                    {(isDev ||
                      asset?.collection?.safelist_request_status === "verified") && (
                      <img
                        src={BlueChip}
                        style={{ width: "fit-content", marginLeft: "10px" }}
                        alt="blue-chip"
                      />
                    )}
                  </Typography>
                ))}
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
                  disableScrollLock={true}
                >
                  {viewLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.url}
                      style={{ textDecoration: "none", fontSize: "1em" }}
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
                          <Typography
                            variant="h6"
                            style={{
                              fontWeight: "normal",
                              fontSize: "1em",
                            }}
                          >
                            {link.title}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: "10px", mt: "0px" }}>
                          <img
                            src={link.endIcon}
                            style={{ width: "9px" }}
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
                alignItems: "center",
                minWidth: "50%",
                pb: "1em",
              }}
            >
              <Chip
                label={
                  asset.status === AssetStatus.New
                    ? "Unlisted"
                    : asset.status === AssetStatus.Locked
                    ? "Escrow"
                    : asset.status
                }
                sx={{
                  backgroundColor:
                    asset.status === AssetStatus.New
                      ? "#f2f2f2 !important"
                      : asset.status === AssetStatus.Locked
                      ? "black !important"
                      : "#374FFF !important",
                  color:
                    asset.status === AssetStatus.New
                      ? "black !important"
                      : "white !important",
                  textTransform: "none",
                }}
                className="dark"
              />
              <Typography component="span" sx={{ mx: "10px" }}>
                <div
                  style={{
                    background: "black",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                  }}
                >
                  {" "}
                </div>
              </Typography>
              <Chip label={asset.mediaType || "Art"} className="light" />
              {isOwner &&
                asset?.status === AssetStatus.Locked &&
                activeLoan &&
                activeLoan?.contractLoanId == null &&
                (isPending ? (
                  <Button variant="contained" disabled>
                    <CircularProgress />
                  </Button>
                ) : (
                  <Button
                    sx={{ ml: "20px", py: "10px", px: "15px" }}
                    variant="contained"
                    onClick={() => resetStatus()}
                  >
                    Unlock Asset
                  </Button>
                ))}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", mb: "3em" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "30px",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    padding: "1.5em",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flex: "0 0 50%",
                      marginRight: "20px",
                    }}
                  >
                    <AssetOwnerTag asset={asset} />
                  </Box>
                  <QuickStatus listing={listing} />
                </Box>
                {nftPrices && nftPrices.length > 0 && (
                  <Paper
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "24px",
                    }}
                  >
                    <PriceInfo prices={nftPrices} />
                  </Paper>
                )}
              </Box>
            </Box>
            <StatusInfo asset={asset} listing={listing} loan={activeLoan} />
          </Grid>
        </Grid>
      ) : (
        <Skeleton variant="rectangular"></Skeleton>
      )}
    </Container>
  );
};

export default AssetDetails;
