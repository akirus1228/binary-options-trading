import {
  Box,
  Button,
  Container,
  Paper,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteOfferMutation, useGetAssetQuery } from "../../api/backend-api";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { Listing, Offer, OfferStatus } from "../../types/backend-types";
import style from "./lender-listing-terms.module.scss";
import { AppDispatch, RootState } from "../../store";
import { useTermDetails } from "../../hooks/use-term-details";
import { MakeOffer } from "../make-offer/make-offer";
import LoanConfirmation from "../loan-confirmation/loan-confirmation";
import { useWeb3Context } from "@fantohm/shared-web3";
import OfferConfirmDialog from "../offer-confirm-modal/offer-confirm-dialog";
import { addAlert } from "../../store/reducers/app-slice";

export interface LenderListingTermsProps {
  offers: Offer[];
  listing: Listing;
  sx?: SxProps<Theme>;
}

export function LenderListingTerms(props: LenderListingTermsProps) {
  const dispatch: AppDispatch = useDispatch();
  const { address } = useWeb3Context();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOffer] = useDeleteOfferMutation();
  // logged in user
  const { authSignature } = useSelector((state: RootState) => state.backend);
  // status that tracks the status of a createLoan contract call
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, props.listing.term.currencyAddress)
  );

  const myOffer = props.offers.find(
    (offer) =>
      offer.lender.address.toLowerCase() === address.toLowerCase() &&
      offer.status === OfferStatus.Ready
  );

  // helper to calculate term details like repayment amount
  const { repaymentAmount } = useTermDetails(props.listing.term);

  // query assets from the backend API
  useGetAssetQuery(props.listing.asset.id, {
    skip: !props.listing.asset || !authSignature,
  });

  const onEditOfferDialogClose = () => {
    setEditOfferDialogOpen(false);
  };

  const onEditOfferDialogOpen = () => {
    setEditOfferDialogOpen(true);
  };

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(props.listing.term.currencyAddress));
  }, []);

  // make offer code
  const [createOfferDialogOpen, setCreateOfferDialogOpen] = useState(false);
  const [editOfferDialogOpen, setEditOfferDialogOpen] = useState(false);

  const handleMakeOffer = () => {
    if (!myOffer) {
      setCreateOfferDialogOpen(true);
    } else {
      setConfirmOpen(true);
    }
  };

  const handleDeleteOffer = useCallback(async () => {
    if (!myOffer) {
      return;
    }
    deleteOffer(myOffer);
    dispatch(addAlert({ message: "Offer removed" }));
  }, [myOffer]);

  const onListDialogClose = () => {
    setCreateOfferDialogOpen(false);
  };

  return (
    <Container sx={props.sx} className={style["assetRow"]}>
      <MakeOffer
        onClose={onListDialogClose}
        open={createOfferDialogOpen}
        listing={props.listing}
      />
      {myOffer && (
        <MakeOffer
          onClose={onEditOfferDialogClose}
          open={editOfferDialogOpen}
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          listing={myOffer.assetListing}
          isEdit={true}
          offerTerm={myOffer.term}
        />
      )}
      <OfferConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onEdit={onEditOfferDialogOpen}
        onRemove={handleDeleteOffer}
      ></OfferConfirmDialog>
      <Paper>
        <Box className="flex fr fw" sx={{ padding: "1.5em 1.5em 1em 1.5em" }}>
          <Box className="flex fc" sx={{ marginRight: "80px" }}>
            <Typography
              className={style["label"]}
              sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
            >
              Loan amount
            </Typography>
            <Box sx={{ display: "flex" }}>
              <img
                src={currency?.icon}
                alt={currency?.symbol}
                style={{ width: "20px", marginRight: "7px" }}
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (props.listing.term.amount * currency?.lastPrice).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                    }
                  )
                }
              >
                <Typography className={`${style["data"]} ${style["primary"]}`}>
                  {props.listing.term.amount.toFixed(4)}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
          <Box className="flex fc" sx={{ marginRight: "80px" }}>
            <Typography
              className={style["label"]}
              sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
            >
              Repayment
            </Typography>
            <Box sx={{ display: "flex" }}>
              <img
                src={currency?.icon}
                alt={currency?.symbol}
                style={{ width: "20px", marginRight: "7px" }}
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (repaymentAmount * currency?.lastPrice).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              >
                <Typography className={`${style["data"]}`}>
                  {repaymentAmount.toFixed(4)}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
          <Box className="flex fc" sx={{ marginRight: "80px" }}>
            <Typography
              className={style["label"]}
              sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
            >
              Duration
            </Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.term.duration} days
            </Typography>
          </Box>
          <Box className="flex fc" sx={{ marginRight: "80px" }}>
            <Typography
              className={style["label"]}
              sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
            >
              APY
            </Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.term.apr}%
            </Typography>
          </Box>
          <Box className="flex fc" sx={{ flex: "0 0 18%", marginLeft: "auto" }}>
            <LoanConfirmation listing={props.listing} />
          </Box>
          <Box className="flex fc" sx={{ flex: "0 0 18%", marginLeft: "10px" }}>
            <Button
              variant="outlined"
              onClick={handleMakeOffer}
              sx={{ width: "100%", padding: "0.7rem 0" }}
            >
              Make Offer
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderListingTerms;
