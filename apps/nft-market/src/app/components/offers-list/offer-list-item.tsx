import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { PaperTableCell, PaperTableRow } from "@fantohm/shared-ui-themes";
import { addressEllipsis, formatCurrency } from "@fantohm/shared-helpers";
import { useTermDetails } from "../../hooks/use-term-details";
import {
  AssetStatus,
  ListingStatus,
  Loan,
  LoanStatus,
  Offer,
  OfferStatus,
} from "../../types/backend-types";
import {
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useResetPartialLoanMutation,
} from "../../api/backend-api";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../store";
import { selectNftPermFromAsset } from "../../store/selectors/wallet-selectors";
import { contractCreateLoan } from "../../store/reducers/loan-slice";
import {
  requestNftPermission,
  useWeb3Context,
  checkNftPermission,
  prettifySeconds,
  networks,
} from "@fantohm/shared-web3";
import style from "./offers-list.module.scss";
import SimpleProfile from "../simple-profile/simple-profile";
import { OffersListFields } from "./offers-list";
import ArrowUpRight from "../../../assets/icons/arrow-right-up.svg";
import { desiredNetworkId } from "../../constants/network";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import { addAlert } from "../../store/reducers/app-slice";
import MakeOffer from "../make-offer/make-offer";
import RemoveOfferConfirmDialog from "../remove-offer-confirm-modal/remove-offer-confirm-dialog";

export type OfferListItemProps = {
  offer: Offer;
  fields?: OffersListFields[];
};

type AppDispatch = typeof store.dispatch;

export const OfferListItem = ({ offer, fields }: OfferListItemProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);
  const [isRequestingPerms, setIsRequestingPerms] = useState(false);
  const { user } = useSelector((state: RootState) => state.backend);
  const { loanCreationStatus } = useSelector((state: RootState) => state.loans);
  const { address: walletAddress, provider } = useWeb3Context();
  const { repaymentTotal, repaymentAmount } = useTermDetails(offer.term);
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, offer.term.currencyAddress)
  );

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(offer.term.currencyAddress));
  }, [offer]);

  // create loan backend api call
  const [createLoan, { data: loanData, isLoading: isCreating, reset: resetCreateLoan }] =
    useCreateLoanMutation();
  const [updateLoan, { isLoading: isUpdating, reset: resetUpdateLoan }] =
    useUpdateLoanMutation();
  const [resetPartialLoan, { isLoading: isResetting, reset: resetResetPartialLoan }] =
    useResetPartialLoanMutation();

  const [updateOffer, { isLoading: isUpdatingOffer }] = useUpdateOfferMutation();
  const [deleteOffer, { isLoading: isDeletingOffer }] = useDeleteOfferMutation();

  // nft permission status updates from state
  const { requestPermStatus } = useSelector((state: RootState) => state.wallet);

  const asset = useMemo(() => offer?.assetListing?.asset, [offer]);

  // select perm status for this asset from state
  const hasPermission = useSelector((state: RootState) =>
    selectNftPermFromAsset(state, offer?.assetListing?.asset)
  );

  // is the user the owner of the asset?
  const isOwner = useMemo(() => {
    if (!user.address || !asset.owner?.address) return false;
    return user.address.toLowerCase() === asset?.owner?.address.toLowerCase();
  }, [asset, user]);

  const isMyOffer = useMemo(() => {
    if (!user.address) return false;
    return user.address.toLowerCase() === offer?.lender?.address.toLowerCase();
  }, [user]);

  // update offer dialog
  const [makeOfferDialogOpen, setMakeOfferDialogOpen] = useState(false);
  const [removeOfferConfirmDialogOpen, setRemoveOfferConfirmDialogOpen] = useState(false);

  const handleUpdateOffer = () => {
    setMakeOfferDialogOpen(true);
  };

  const onDialogClose = () => {
    setMakeOfferDialogOpen(false);
  };

  useEffect(() => {
    if (
      isUpdatingOffer ||
      isDeletingOffer ||
      isCreating ||
      isUpdating ||
      requestPermStatus === "loading" ||
      loanCreationStatus === "loading"
    ) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }
  }, [
    isUpdatingOffer,
    isDeletingOffer,
    isCreating,
    requestPermStatus,
    loanCreationStatus,
    isUpdating,
  ]);

  // check the contract to see if we have perms already
  useEffect(() => {
    if (offer.assetListing.asset.assetContractAddress && provider) {
      dispatch(
        checkNftPermission({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: offer.assetListing.asset.assetContractAddress,
          tokenId: offer.assetListing.asset.tokenId,
        })
      );
    }
  }, [offer]);

  const handleRequestPermission = useCallback(async () => {
    // create the loan
    if (!hasPermission && provider) {
      setIsRequestingPerms(true);
      setIsPending(true);
      await dispatch(
        requestNftPermission({
          networkId: desiredNetworkId,
          provider,
          assetAddress: offer.assetListing.asset.assetContractAddress,
          walletAddress,
          tokenId: offer.assetListing.asset.tokenId,
        })
      );
      setIsPending(false);
    }
  }, [offer.id, provider, hasPermission]);

  // automatically trigger accept offer after setting up perms
  useEffect(() => {
    if (isRequestingPerms && requestPermStatus !== "loading") {
      handleAcceptOffer();
    }
  }, [requestPermStatus, isRequestingPerms]);

  const handleAcceptOffer = useCallback(async () => {
    // create the loan
    if (!hasPermission || !provider || !asset.owner) {
      console.warn("You must first provide permission to your NFT");
      return;
    }
    setIsPending(true);

    const createLoanRequest: Loan = {
      lender: offer.lender,
      borrower: asset.owner,
      assetListing: {
        ...offer.assetListing,
        status: ListingStatus.Completed,
        asset: { ...asset, status: AssetStatus.Locked },
      },
      lendingContractAddress:
        networks[desiredNetworkId].addresses["USDB_LENDING_ADDRESS_V2"] ||
        networks[desiredNetworkId].addresses["USDB_LENDING_ADDRESS"],
      term: offer.term,
      status: LoanStatus.Active,
      offerId: offer.id,
    };

    const createLoanParams = {
      loan: createLoanRequest,
      provider,
      networkId: desiredNetworkId,
      currencyAddress: offer.term.currencyAddress,
    };
    let createLoanResult;
    try {
      createLoanResult = await createLoan(createLoanRequest).unwrap();
      if (!createLoanResult) {
        setIsPending(false);
        return; //todo: throw nice error
      }
      const createLoanContractResult = await dispatch(
        contractCreateLoan(createLoanParams)
      ).unwrap();

      if (!createLoanContractResult) {
        setIsPending(false);
        resetCreateLoan();
        resetPartialLoan(createLoanResult?.id || "");
        return; //todo: throw nice error
      }

      createLoanRequest.contractLoanId = createLoanContractResult as number;
      createLoanRequest.id = createLoanResult.id;
      await updateLoan(createLoanRequest).unwrap();

      resetUpdateLoan();
      dispatch(
        addAlert({
          message:
            "Loan Created. NFT Has been transferred to escrow, and funds transferred to borrower.",
        })
      );
    } catch (e: any) {
      if (e?.data?.message) {
        dispatch(
          addAlert({
            message: e?.data?.message,
          })
        );
      }
      if (createLoanResult) {
        resetPartialLoan(createLoanResult?.id);
      }
    } finally {
      setIsPending(false);
    }
  }, [offer.id, offer.term, offer.assetListing, provider, hasPermission]);

  const handleDeleteOffer = useCallback(async () => {
    deleteOffer(offer);
    dispatch(addAlert({ message: "Offer removed" }));
  }, [offer.id]);

  const offerExpires = useMemo(() => {
    const offerDateTime = new Date(offer.term.expirationAt);
    const expiresInSeconds = offerDateTime.getTime() - Date.now();
    const prettyTime = prettifySeconds(expiresInSeconds / 1000);
    return prettyTime !== "Instant" ? prettyTime : "Expired";
  }, [offer.term]);

  const offerCreatedSecondsAgo = useMemo(() => {
    if (!offer.createdAt) return 0;
    const offerDateTime = new Date(offer.createdAt);
    const createdAgo = Date.now() - offerDateTime.getTime();
    return prettifySeconds(createdAgo / 1000);
  }, [offer.term]);

  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const actionsOpen = Boolean(actionMenuAnchorEl);

  const handleOpenActionClick = (event: MouseEvent<HTMLElement>) => {
    setActionMenuAnchorEl(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
  };

  const getFieldData = (field: OffersListFields): JSX.Element | string => {
    switch (field) {
      case OffersListFields.LENDER_PROFILE:
        return <SimpleProfile address={offer.lender.address} />;
      case OffersListFields.LENDER_ADDRESS:
        return (
          <a href={`https://etherscan.io/address/${offer.lender.address}`}>
            {offer.lender.address.toLowerCase() === user.address.toLowerCase() ? (
              "You"
            ) : (
              <Box>
                {addressEllipsis(offer.lender.address)}{" "}
                <img
                  src={ArrowUpRight}
                  alt="arrow pointing up and to the right"
                  style={{ height: "16px", width: "16px" }}
                />
              </Box>
            )}
          </a>
        );
      case OffersListFields.BORROWER_ADDRESS:
        return (
          <a
            href={`https://etherscan.io/address/${offer.assetListing.asset?.owner.address}`}
          >
            {offer.assetListing.asset?.owner.address.toLowerCase() ===
            user.address.toLowerCase() ? (
              "You"
            ) : (
              <Box>
                {addressEllipsis(offer.assetListing.asset?.owner.address)}{" "}
                <img
                  src={ArrowUpRight}
                  alt="arrow pointing up and to the right"
                  style={{ height: "16px", width: "16px" }}
                />
              </Box>
            )}
          </a>
        );
      case OffersListFields.OWNER_PROFILE:
        return <SimpleProfile address={offer.lender.address} />;
      case OffersListFields.REPAYMENT_TOTAL:
        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title={currency?.name || ""}>
              <img
                src={currency?.icon || ""}
                alt={currency?.symbol || ""}
                style={{
                  height: "20px",
                  width: "20px",
                  marginRight: "5px",
                  marginBottom: "4px",
                }}
              />
            </Tooltip>
            <Tooltip
              title={`~ ${formatCurrency(repaymentTotal * currency?.lastPrice || 0, 2)}`}
            >
              <span>{repaymentTotal.toFixed(4)} </span>
            </Tooltip>
          </Box>
        );
      case OffersListFields.PRINCIPAL:
        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title={currency?.name || ""}>
              <img
                src={currency?.icon || ""}
                alt={currency?.symbol || ""}
                style={{
                  height: "20px",
                  width: "20px",
                  marginRight: "5px",
                  marginBottom: "4px",
                }}
              />
            </Tooltip>
            <Tooltip
              title={`~ ${formatCurrency(
                offer.term.amount * currency?.lastPrice || 0,
                2
              )}`}
            >
              <span>{offer.term.amount.toFixed(4)} </span>
            </Tooltip>
          </Box>
        );
      case OffersListFields.TOTAL_INTEREST:
        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title={currency?.name || ""}>
              <img
                src={currency?.icon || ""}
                alt={currency?.symbol || ""}
                style={{
                  height: "20px",
                  width: "20px",
                  marginRight: "5px",
                  marginBottom: "4px",
                }}
              />
            </Tooltip>
            <Tooltip
              title={`~ ${formatCurrency(repaymentAmount * currency?.lastPrice || 0, 2)}`}
            >
              <span>{repaymentAmount?.toFixed(4)}</span>
            </Tooltip>
          </Box>
        );
      case OffersListFields.APR:
        return `${offer.term.apr}%`;
      case OffersListFields.DURATION:
        return `${offer.term.duration} days`;
      case OffersListFields.EXPIRATION:
        return offerExpires;
      case OffersListFields.ASSET:
        return <Avatar src={offer.assetListing.asset.imageUrl || ""} />;
      case OffersListFields.NAME:
        return (
          <Link
            to={`/asset/${offer.assetListing.asset.assetContractAddress}/${offer.assetListing.asset.tokenId}`}
          >
            {offer.assetListing.asset.name || ""}
          </Link>
        );
      case OffersListFields.CREATED_AGO:
        return <span style={{ marginRight: "2em" }}>{offerCreatedSecondsAgo} ago</span>;
      case OffersListFields.STATUS:
        return offer.status !== OfferStatus.Ready ? (
          <Chip
            label={offer.status}
            sx={{
              fontSize: "0.875em",
              marginRight: "2em",
              backgroundColor: "#374FFF",
              color: "#fff",
            }}
          ></Chip>
        ) : (
          <></>
        );
      default:
        return "?";
    }
  };

  return (
    <>
      <MakeOffer
        onClose={onDialogClose}
        open={makeOfferDialogOpen}
        listing={offer?.assetListing}
        isEdit={true}
        offerTerm={offer?.term}
      />
      <RemoveOfferConfirmDialog
        open={removeOfferConfirmDialogOpen}
        setOpen={setRemoveOfferConfirmDialogOpen}
        onRemove={handleDeleteOffer}
      />
      <PaperTableRow className={style["row"]}>
        {fields?.map((field: OffersListFields, index: number) => (
          <PaperTableCell key={`offer-list-row-${index}`} className={style["offerElem"]}>
            <Box className="flex fr ai-c">{getFieldData(field)}</Box>
          </PaperTableCell>
        ))}
        <PaperTableCell
          sx={{
            display: "flex",
            fontSize: "1rem",
            alignItems: "middle",
            marginRight: "20px",
          }}
        >
          <Box className="flex fr ai-c">
            {offer.status !== OfferStatus.Ready && (
              <Chip
                label={offer.status}
                sx={{
                  fontSize: "0.875em",
                  marginRight: "2em",
                  backgroundColor: "#374FFF",
                  color: "#fff",
                }}
              ></Chip>
            )}
            {((isOwner && offer.status === OfferStatus.Ready) || isMyOffer) && (
              <IconButton onClick={handleOpenActionClick}>
                {!actionsOpen && <ChevronLeftIcon />}
                {actionsOpen && <ChevronRightIcon />}
              </IconButton>
            )}
            <Menu
              open={actionsOpen}
              anchorEl={actionMenuAnchorEl}
              onClose={handleActionMenuClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
              disableScrollLock={true}
            >
              {isOwner &&
                !hasPermission &&
                offer.status === OfferStatus.Ready &&
                Date.parse(offer.term.expirationAt) > Date.now() &&
                (isPending ? (
                  <Button variant="contained" className="offer slim">
                    <CircularProgress />
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className="offer slim"
                    onClick={handleRequestPermission}
                  >
                    Accept
                  </Button>
                ))}
              {isOwner &&
                hasPermission &&
                offer.status === OfferStatus.Ready &&
                (isPending ? (
                  <Button variant="contained" className="offer slim">
                    <CircularProgress />
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className="offer slim"
                    onClick={handleAcceptOffer}
                  >
                    Accept
                  </Button>
                ))}
              {!isOwner && isMyOffer && offer.status === OfferStatus.Ready && (
                <Box>
                  <Button
                    variant="contained"
                    className="offer slim"
                    sx={{ my: "10px", mr: "10px", width: "100px" }}
                    onClick={handleUpdateOffer}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    className="offer slim"
                    sx={{ my: "10px", width: "100px" }}
                    onClick={() => setRemoveOfferConfirmDialogOpen(true)}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Menu>
          </Box>
        </PaperTableCell>
      </PaperTableRow>
    </>
  );
};
