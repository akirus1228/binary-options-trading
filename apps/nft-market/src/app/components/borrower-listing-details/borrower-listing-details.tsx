import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useListingTermDetails } from "../../hooks/use-listing-terms";
import { AppDispatch, RootState } from "../../store";
import { selectListingFromAsset } from "../../store/selectors/listing-selectors";
import { Asset, Listing } from "../../types/backend-types";
import { useGetListingsQuery } from "../../api/backend-api";
import UpdateTerms from "../update-terms/update-terms";
import style from "./borrower-listing-details.module.scss";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";

export interface BorrowerListingDetailsProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const BorrowerListingDetails = (
  props: BorrowerListingDetailsProps
): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { user, authSignature } = useSelector((state: RootState) => state.backend);
  const listing: Listing = useSelector((state: RootState) =>
    selectListingFromAsset(state, props.asset)
  );
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, listing?.term?.currencyAddress || "")
  );

  useEffect(() => {
    if (!listing?.term?.currencyAddress) return;
    dispatch(loadCurrencyFromAddress(listing.term.currencyAddress));
  }, [listing?.term?.currencyAddress]);

  useGetListingsQuery(
    {
      skip: 0,
      take: 50,
      openseaIds: props.asset.openseaId ? [props.asset?.openseaId] : [],
    },
    { skip: !authSignature || !user.address }
  );

  // calculate repayment totals
  const { repaymentTotal } = useListingTermDetails(listing);

  // update term
  const [dialogOpen, setDialogOpen] = useState(false);
  const onClickButton = useCallback(() => {
    console.log("Open dialog");
    setDialogOpen(true);
  }, []);

  const onListDialogClose = (accepted: boolean) => {
    setDialogOpen(false);
  };

  if (typeof listing.term === "undefined") {
    return <h3>Loading...</h3>;
  }

  return (
    <Container sx={props.sx}>
      <UpdateTerms onClose={onListDialogClose} open={dialogOpen} listing={listing} />
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Total repayment</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              {repaymentTotal.toFixed(4)} {currency?.symbol}
            </Typography>
            <Typography className={`${style["data"]} ${style["secondary"]}`}>
              ~
              {(repaymentTotal * currency?.lastPrice).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]}`}>
              {listing.term.amount.toFixed(4)}
            </Typography>
            <Typography className={`${style["data"]} ${style["secondary"]}`}>
              {(listing.term.amount * currency?.lastPrice).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>{listing.term.apr}%</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until offer expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>
                {new Date(Date.parse(listing.term.expirationAt)).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Box className="flex fc">
            <Button variant="contained" onClick={onClickButton}>
              Update Terms
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerListingDetails;
