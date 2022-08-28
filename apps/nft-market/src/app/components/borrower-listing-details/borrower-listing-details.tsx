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
import { useListingTermDetails } from "../../hooks/use-listing-terms";
import { AppDispatch, RootState } from "../../store";
import { selectListingFromAsset } from "../../store/selectors/listing-selectors";
import { Asset, Listing } from "../../types/backend-types";
import { useGetListingsQuery } from "../../api/backend-api";
import UpdateTerms from "../update-terms/update-terms";
import style from "./borrower-listing-details.module.scss";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import CancelListing from "../cancel-listing/cancel-listing";
import { formatCurrency } from "@fantohm/shared-web3";

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
  const [dialogUpdateTermsOpen, setDialogUpdateTermsOpen] = useState(false);
  const onDialogUpdateTermsOpen = useCallback(() => {
    setDialogUpdateTermsOpen(true);
  }, []);

  const onDialogUpdateTermsClose = (accepted: boolean) => {
    setDialogUpdateTermsOpen(false);
  };

  // close listing
  const [dialogCancelListingOpen, setDialogCancelListingOpen] = useState(false);
  const onDialogCancelListingOpen = useCallback(() => {
    setDialogCancelListingOpen(true);
  }, []);

  const onDialogCancelListingClose = (accepted: boolean) => {
    setDialogCancelListingOpen(false);
  };

  if (typeof listing.term === "undefined") {
    return <h3>Loading...</h3>;
  }

  return (
    <Container sx={props.sx}>
      <UpdateTerms
        onClose={onDialogUpdateTermsClose}
        open={dialogUpdateTermsOpen}
        listing={listing}
      />
      <CancelListing
        onClose={onDialogCancelListingClose}
        open={dialogCancelListingOpen}
        listing={listing}
      />
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Loan amount</Typography>
            <Typography
              className={`${style["data"]}`}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={currency.icon}
                style={{ width: "20px", height: "20px", marginRight: "7px" }}
                alt=""
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (listing.term.amount * currency?.lastPrice).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              >
                <Typography component="span">
                  {formatCurrency(listing.term.amount, 2).replace("$", "")}
                </Typography>
              </Tooltip>
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Repayment</Typography>
            <Typography
              className={`${style["data"]} ${style["primary"]}`}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={currency.icon}
                style={{ width: "20px", height: "20px", marginRight: "7px" }}
                alt=""
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (repaymentTotal * currency?.lastPrice).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              >
                <Typography component="span">
                  {formatCurrency(repaymentTotal, 2).replace("$", "")}
                </Typography>
              </Tooltip>
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Duration</Typography>
            <Typography className={`${style["data"]}`}>
              {listing.term.duration} days
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>{listing.term.apr}%</Typography>
          </Box>
          {/* <Box className="flex fc">
            <Typography className={style["label"]}>Time until offer expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>
                {new Date(Date.parse(listing.term.expirationAt)).toLocaleString()}
              </Typography>
            </Box>
          </Box> */}
          <Box className="flex fc">
            <Button
              variant="contained"
              onClick={onDialogUpdateTermsOpen}
              style={{ backgroundColor: "#374fff" }}
            >
              Update Terms
            </Button>
          </Box>
          <Box className="flex fc">
            <Button variant="outlined" onClick={onDialogCancelListingOpen}>
              Cancel Listing
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerListingDetails;
