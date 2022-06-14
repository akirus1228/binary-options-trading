import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAssetQuery } from "../../api/backend-api";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { Listing } from "../../types/backend-types";
import style from "./lender-listing-terms.module.scss";
import { AppDispatch, RootState } from "../../store";
import { useTermDetails } from "../../hooks/use-term-details";
import { MakeOffer } from "../make-offer/make-offer";
import LoanConfirmation from "../loan-confirmation/loan-confirmation";

export interface LenderListingTermsProps {
  listing: Listing;
  sx?: SxProps<Theme>;
}

export function LenderListingTerms(props: LenderListingTermsProps) {
  const dispatch: AppDispatch = useDispatch();
  // logged in user
  const { authSignature } = useSelector((state: RootState) => state.backend);
  // status that tracks the status of a createLoan contract call
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, props.listing.term.currencyAddress)
  );

  // helper to calculate term details like repayment amount
  const { repaymentAmount } = useTermDetails(props.listing.term);

  // query assets from the backend API
  useGetAssetQuery(props.listing.asset.id, {
    skip: !props.listing.asset || !authSignature,
  });

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(props.listing.term.currencyAddress));
  }, []);

  // make offer code
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMakeOffer = () => {
    setDialogOpen(true);
  };

  const onListDialogClose = (accepted: boolean) => {
    setDialogOpen(false);
  };

  return (
    <Container sx={props.sx}>
      <MakeOffer onClose={onListDialogClose} open={dialogOpen} listing={props.listing} />
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              {props.listing.term.amount.toFixed(4)} {currency?.symbol}
            </Typography>
            <span className={`${style["data"]} ${style["secondary"]}`}>
              (
              {!!currency &&
                currency?.lastPrice &&
                "~" &&
                (props.listing.term.amount * currency?.lastPrice).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  }
                )}
              {currency?.lastPrice === 0 && "Unable to load estimated USD value"})
            </span>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Repayment</Typography>
            <Typography className={`${style["data"]}`}>
              {repaymentAmount.toFixed(4)} {currency?.symbol}
            </Typography>
            <span className="subtle">
              (
              {!!currency &&
                currency?.lastPrice &&
                "~" &&
                (repaymentAmount * currency?.lastPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              )
            </span>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Duration</Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.term.duration} days
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.term.apr}%
            </Typography>
          </Box>
          <Box className="flex fc">
            <Button variant="contained" onClick={handleMakeOffer}>
              Make Offer
            </Button>
          </Box>
          <Box className="flex fc">
            <LoanConfirmation listing={props.listing} />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderListingTerms;
