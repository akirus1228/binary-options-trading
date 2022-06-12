import {
  checkErc20Allowance,
  requestErc20Allowance,
  selectErc20AllowanceByAddress,
  useWeb3Context,
  loadPlatformFee,
} from "@fantohm/shared-web3";
import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateLoanMutation, useGetAssetQuery } from "../../api/backend-api";
import { contractCreateLoan } from "../../store/reducers/loan-slice";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import {
  AssetStatus,
  BackendLoadingStatus,
  Listing,
  ListingStatus,
  Loan,
  LoanStatus,
} from "../../types/backend-types";
import style from "./lender-listing-terms.module.scss";
import { AppDispatch, RootState } from "../../store";
import { useTermDetails } from "../../hooks/use-term-details";
import { MakeOffer } from "../make-offer/make-offer";
import { ethers } from "ethers";
import { desiredNetworkId } from "../../constants/network";

export interface LenderListingTermsProps {
  listing: Listing;
  sx?: SxProps<Theme>;
}

export function LenderListingTerms(props: LenderListingTermsProps) {
  const dispatch: AppDispatch = useDispatch();
  const { provider, chainId, address } = useWeb3Context();
  // logged in user
  const { user, authSignature } = useSelector((state: RootState) => state.backend);
  // status of contract calls for allowance and platform fee
  const { checkErc20AllowanceStatus, requestErc20AllowanceStatus, platformFees } =
    useSelector((state: RootState) => state.wallet);
  // status that tracks the status of a createLoan contract call
  const { loanCreationStatus } = useSelector((state: RootState) => state.loans);
  // select the USDB allowance provided to lending contract for this address
  const allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: address,
      erc20TokenAddress: props.listing.term.currencyAddress,
    })
  );
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, props.listing.term.currencyAddress)
  );

  // helper to calculate term details like repayment amount
  const { repaymentAmount } = useTermDetails(props.listing.term);
  // createloan backend api call
  const [
    createLoan,
    { isLoading: isCreating, error: createLoanError, data: createLoanData },
  ] = useCreateLoanMutation();

  // query assets from the backend API
  const { data: asset, isLoading: isAssetLoading } = useGetAssetQuery(
    props.listing.asset.id,
    { skip: !props.listing.asset || !authSignature }
  );

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(props.listing.term.currencyAddress));
  }, []);

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    if (provider && address) {
      dispatch(
        loadPlatformFee({
          networkId: desiredNetworkId,
          address,
          currencyAddress: props.listing.term.currencyAddress,
        })
      );
    }
  }, [provider, address, props.listing.term.currencyAddress]);

  const isPending: boolean = useMemo(() => {
    if (
      !isAssetLoading &&
      !isCreating &&
      checkErc20AllowanceStatus !== BackendLoadingStatus.loading &&
      requestErc20AllowanceStatus !== BackendLoadingStatus.loading
    )
      return false;
    return true;
  }, [
    isAssetLoading,
    isCreating,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
  ]);

  // click accept term button
  const handleAcceptTerms = useCallback(async () => {
    if (
      !allowance ||
      allowance.lt(
        ethers.utils.parseEther(
          (
            props.listing.term.amount *
            (1 + platformFees[props.listing.term.currencyAddress])
          ).toString()
        )
      )
    ) {
      console.warn("Insufficiant allownace. Trigger request");
      return;
    }
    if (!provider || !chainId || !address || !asset || !asset.owner) {
      console.warn("missing critical data");
      return;
    }
    const createLoanRequest: Loan = {
      lender: user,
      borrower: asset.owner,
      assetListing: {
        ...props.listing,
        status: ListingStatus.Completed,
        asset: { ...props.listing.asset, status: AssetStatus.Locked },
      },
      term: props.listing.term,
      status: LoanStatus.Active,
    };

    const createLoanParams = {
      loan: createLoanRequest,
      provider,
      networkId: chainId,
    };
    const createLoanResult = await dispatch(
      contractCreateLoan(createLoanParams)
    ).unwrap();
    if (createLoanResult) {
      createLoanRequest.contractLoanId = createLoanResult;
      createLoan(createLoanRequest);
    }
  }, [props.listing, provider, chainId, asset, allowance, user.address]);

  // request allowance necessary to complete txn
  const handleRequestAllowance = useCallback(() => {
    if (
      provider &&
      address &&
      typeof platformFees[props.listing.term.currencyAddress] !== "undefined"
    )
      dispatch(
        requestErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: address,
          assetAddress: props.listing.term.currencyAddress,
          amount: ethers.utils.parseEther(
            (
              props.listing.term.amount *
              (1 + platformFees[props.listing.term.currencyAddress])
            ).toString()
          ),
        })
      );
  }, [
    chainId,
    address,
    props.listing.term.amount,
    provider,
    platformFees[props.listing.term.currencyAddress],
  ]);

  // check to see if we have an approval for the amount required for this txn
  useEffect(() => {
    if (
      chainId &&
      address &&
      provider &&
      platformFees[props.listing.term.currencyAddress]
    ) {
      dispatch(
        checkErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: address,
          assetAddress: props.listing.term.currencyAddress,
        })
      );
    }
  }, [chainId, address, provider, platformFees[props.listing.term.currencyAddress]]);

  const hasAllowance: boolean = useMemo(() => {
    if (
      typeof platformFees[props.listing.term.currencyAddress] !== "undefined" &&
      checkErc20AllowanceStatus === "idle" &&
      requestErc20AllowanceStatus === "idle" &&
      !!allowance &&
      allowance.gte(
        ethers.utils.parseEther(
          (
            props.listing.term.amount *
            (1 + platformFees[props.listing.term.currencyAddress])
          ).toString()
        )
      )
    )
      return true;
    return false;
  }, [
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    allowance,
    props.listing.term.amount,
    platformFees[props.listing.term.currencyAddress],
  ]);

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
              {props.listing.term.amount.toFixed(4)} {currency.symbol}
            </Typography>
            <span className={`${style["data"]} ${style["secondary"]}`}>
              (
              {!!currency &&
                currency.lastPrice &&
                "~" &&
                (props.listing.term.amount * currency.lastPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              {currency.lastPrice === 0 && "Unable to load estimated USD value"})
            </span>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Repayment</Typography>
            <Typography className={`${style["data"]}`}>
              {repaymentAmount.toFixed(4)} {currency.symbol}
            </Typography>
            <span>
              {!!currency &&
                currency.lastPrice &&
                "~" &&
                (repaymentAmount * currency.lastPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
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
            {!hasAllowance && !isPending && (
              <Button variant="outlined" onClick={handleRequestAllowance}>
                Provide Allowance to Your {currency.symbol}
              </Button>
            )}
            {hasAllowance && !isCreating && loanCreationStatus !== "loading" && (
              <Button
                variant="outlined"
                onClick={handleAcceptTerms}
                disabled={isCreating}
              >
                Accept Terms
              </Button>
            )}
            {isPending === true && (
              <Button variant="outlined" disabled={true}>
                Pending...
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderListingTerms;
