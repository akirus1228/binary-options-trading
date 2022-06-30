import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Box, Button, Tooltip } from "@mui/material";
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
import { useCreateLoanMutation, useUpdateOfferMutation } from "../../api/backend-api";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../store";
import { selectNftPermFromAsset } from "../../store/selectors/wallet-selectors";
import { contractCreateLoan } from "../../store/reducers/loan-slice";
import {
  requestNftPermission,
  useWeb3Context,
  checkNftPermission,
  prettifySeconds,
} from "@fantohm/shared-web3";
import style from "./offers-list.module.scss";
import SimpleProfile from "../simple-profile/simple-profile";
import { OffersListFields } from "./offers-list";
import ArrowUpRight from "../../../assets/icons/arrow-right-up.svg";
import { desiredNetworkId } from "../../constants/network";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";

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

  // createloan backend api call
  const [createLoan, { isLoading: isCreating }] = useCreateLoanMutation();

  const [updateOffer, { isLoading: isUpdatingOffer }] = useUpdateOfferMutation();

  // nft permission status updates from state
  const { requestPermStatus } = useSelector((state: RootState) => state.wallet);

  const asset = useMemo(() => offer.assetListing.asset, [offer]);

  // select perm status for this asset from state
  const hasPermission = useSelector((state: RootState) =>
    selectNftPermFromAsset(state, offer.assetListing.asset)
  );

  // is the user the owner of the asset?
  const isOwner = useMemo(() => {
    if (!user.address || !asset.owner?.address) return false;
    return user.address.toLowerCase() === asset?.owner?.address.toLowerCase();
  }, [asset, user]);

  useEffect(() => {
    if (
      (isUpdatingOffer ||
        isCreating ||
        requestPermStatus === "loading" ||
        loanCreationStatus === "loading") &&
      isPending
    ) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }
  }, [isUpdatingOffer, isCreating, requestPermStatus, loanCreationStatus, isPending]);

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
      term: offer.term,
      status: LoanStatus.Active,
    };

    const createLoanParams = {
      loan: createLoanRequest,
      provider,
      networkId: desiredNetworkId,
      currencyAddress: offer.term.currencyAddress,
    };

    const createLoanResult = await dispatch(
      contractCreateLoan(createLoanParams)
    ).unwrap();

    if (createLoanResult) {
      createLoanRequest.contractLoanId = createLoanResult;
      createLoan(createLoanRequest);
    }

    // update offer as accepted
    const updateOfferRequest = { ...offer, status: OfferStatus.Accepted };
    updateOffer(updateOfferRequest);
  }, [offer.id, offer.term, offer.assetListing, provider, hasPermission]);

  const offerExpires = useMemo(() => {
    const offerDateTime = new Date(offer.term.expirationAt);
    const expiresInSeconds = offerDateTime.getTime() - Date.now();
    const prettyTime = prettifySeconds(expiresInSeconds / 1000);
    return prettyTime !== "Instant" ? prettyTime : "Expired";
  }, [offer.term]);

  const offerCreatedSecondsAgo = useMemo(() => {
    if (!offer.term.createdAt) return 0;
    const offerDateTime = new Date(offer.term.createdAt);
    const createdAgo = Date.now() - offerDateTime.getTime();
    return prettifySeconds(createdAgo / 1000);
  }, [offer.term]);

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
                {addressEllipsis(offer.lender.address, 3)}{" "}
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
                {addressEllipsis(offer.assetListing.asset?.owner.address, 3)}{" "}
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
          <Box>
            <Tooltip
              title={`~ ${formatCurrency(repaymentTotal * currency?.lastPrice || 0, 2)}`}
            >
              <span>{repaymentTotal.toFixed(4)} </span>
            </Tooltip>
            <Tooltip title={currency?.name || ""}>
              <img
                src={currency?.icon || ""}
                alt={currency?.symbol || ""}
                style={{
                  height: "20px",
                  width: "20px",
                  marginLeft: "5px",
                  marginBottom: "4px",
                }}
              />
            </Tooltip>
          </Box>
        );
      case OffersListFields.REPAYMENT_AMOUNT:
        return (
          <Box>
            <Tooltip
              title={`~ ${formatCurrency(repaymentAmount * currency?.lastPrice || 0, 2)}`}
            >
              <span>{repaymentAmount?.toFixed(4)}</span>
            </Tooltip>
            <Tooltip title={currency?.name || ""}>
              <img
                src={currency?.icon || ""}
                alt={currency?.symbol || ""}
                style={{
                  height: "20px",
                  width: "20px",
                  marginLeft: "5px",
                  marginBottom: "4px",
                }}
              />
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
      default:
        return "?";
    }
  };

  return (
    <PaperTableRow className={style["row"]}>
      {fields?.map((field: OffersListFields, index: number) => (
        <PaperTableCell key={`offer-list-row-${index}`}>
          <Box className="flex fr ai-c">{getFieldData(field)}</Box>
        </PaperTableCell>
      ))}
      <PaperTableCell>
        {isOwner &&
          !hasPermission &&
          !isPending &&
          offer.status === OfferStatus.Ready &&
          Date.parse(offer.term.expirationAt) > Date.now() && (
            <Button
              variant="contained"
              className="offer slim"
              onClick={handleRequestPermission}
            >
              Accept
            </Button>
          )}
        {isOwner && hasPermission && !isPending && offer.status === OfferStatus.Ready && (
          <Button variant="contained" className="offer slim" onClick={handleAcceptOffer}>
            Accept
          </Button>
        )}
        {isPending && (
          <Button variant="contained" className="offer slim">
            Pending...
          </Button>
        )}
        {!isOwner && (
          <span style={{ marginRight: "2em" }}>{offerCreatedSecondsAgo} ago</span>
        )}
        {(!isOwner || offer.status !== OfferStatus.Ready) && (
          <Button
            variant="contained"
            className="offer slim"
            disabled={[OfferStatus.Expired, OfferStatus.Cancelled].includes(offer.status)}
          >
            {offer.status}
          </Button>
        )}
      </PaperTableCell>
    </PaperTableRow>
  );
};
