import {
  checkErc20Allowance,
  prettifySeconds,
  requestErc20Allowance,
  selectErc20AllowanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../store";
import { useUpdateLoanMutation } from "../../api/backend-api";
import {
  getLoanDetailsFromContract,
  LoanDetails,
  repayLoan,
} from "../../store/reducers/loan-slice";
import { Asset, AssetStatus, Loan, LoanStatus } from "../../types/backend-types";
import style from "./borrower-loan-details.module.scss";
import { desiredNetworkId } from "../../constants/network";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";

export interface BorrowerLoanDetailsProps {
  asset: Asset;
  loan: Loan;
  sx?: SxProps<Theme>;
}

type AppDispatch = typeof store.dispatch;

export const BorrowerLoanDetails = ({
  asset,
  loan,
  sx,
}: BorrowerLoanDetailsProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { provider } = useWeb3Context();
  const [isPending, setIsPending] = useState(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({} as LoanDetails);
  // select logged in user
  const { user } = useSelector((state: RootState) => state.backend);
  const { repayLoanStatus } = useSelector((state: RootState) => state.loans);

  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, loan.term.currencyAddress)
  );

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(loan.term.currencyAddress));
  }, []);

  // status of allowance check or approval
  const { checkErc20AllowanceStatus, requestErc20AllowanceStatus } = useSelector(
    (state: RootState) => state.wallet
  );

  // select the currency allowance provided to lending contract for this address
  const erc20Allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: user.address,
      erc20TokenAddress: loanDetails.currency || "",
    })
  );

  const [updateLoan, { isLoading: isLoanUpdating }] = useUpdateLoanMutation();

  // check to see if we have an approval for the amount required for this txn
  useEffect(() => {
    if (
      user.address &&
      provider &&
      loanDetails.currency &&
      loanDetails.currency !== "0x0000000000000000000000000000000000000000" &&
      !erc20Allowance
    ) {
      dispatch(
        checkErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: loanDetails.currency,
        })
      );
    }
  }, [user.address, provider, loanDetails.currency, erc20Allowance]);

  useEffect(() => {
    if (!loan || !loan.contractLoanId || !provider) return;
    dispatch(
      getLoanDetailsFromContract({
        loanId: loan.contractLoanId,
        networkId: desiredNetworkId,
        provider,
      })
    )
      .unwrap()
      .then((loanDetails: LoanDetails) => setLoanDetails(loanDetails));
  }, [loan]);

  const handleRepayLoan = useCallback(async () => {
    if (!loan.contractLoanId || !provider) return;
    if (erc20Allowance && erc20Allowance.gte(loanDetails.amountDueGwei)) {
      const repayLoanParams = {
        loanId: loan.contractLoanId,
        amountDue: loanDetails.amountDueGwei,
        provider,
        networkId: desiredNetworkId,
      };
      const repayLoanResult = await dispatch(repayLoan(repayLoanParams)).unwrap();
      if (repayLoanResult === false) return; //todo: throw nice error
      const updateLoanRequest: Loan = {
        ...loan,
        assetListing: {
          ...loan.assetListing,
          asset: { ...loan.assetListing.asset, status: AssetStatus.Ready },
        },
        status: LoanStatus.Complete,
      };
      updateLoan(updateLoanRequest);
    } else {
      console.warn(`insufficiant allowance: ${erc20Allowance}`);
    }
  }, [
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    erc20Allowance,
    loanDetails.amountDueGwei,
  ]);

  const handleRequestAllowance = useCallback(async () => {
    if (!provider) return;
    dispatch(
      requestErc20Allowance({
        networkId: desiredNetworkId,
        provider,
        walletAddress: user.address,
        assetAddress: loanDetails.currency,
        amount: loanDetails.amountDueGwei,
      })
    );
  }, [
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    erc20Allowance,
    loanDetails.amountDueGwei,
  ]);

  useEffect(() => {
    // if nothing is loading and pending is true, stop pending
    if (
      isLoanUpdating === false &&
      requestErc20AllowanceStatus !== "loading" &&
      checkErc20AllowanceStatus !== "loading" &&
      repayLoanStatus !== "loading" &&
      isPending === true
    ) {
      setIsPending(false);
    }

    // if pending is false, but something is loading, start pending
    if (
      isPending === false &&
      (isLoanUpdating === true ||
        requestErc20AllowanceStatus === "loading" ||
        checkErc20AllowanceStatus === "loading" ||
        repayLoanStatus === "loading")
    ) {
      setIsPending(true);
    }
  }, [
    isPending,
    isLoanUpdating,
    requestErc20AllowanceStatus,
    checkErc20AllowanceStatus,
    repayLoanStatus,
  ]);

  const [currentBlockTime, setCurrentBlockTime] = useState<number>();

  useEffect(() => {
    if (!provider) {
      return;
    }
    provider.getBlockNumber().then((blockNumber) => {
      provider.getBlock(blockNumber).then((block) => {
        setCurrentBlockTime(block.timestamp);
      });
    });
  }, [provider]);

  const canRepay = useMemo(() => {
    return (
      loanDetails?.endTime && currentBlockTime && loanDetails.endTime >= currentBlockTime
    );
  }, [loanDetails, currentBlockTime]);

  if (!loan || !loan.term || !loanDetails.amountDue) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Container sx={sx}>
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Total repayment</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              {(loanDetails.amountDue * currency?.lastPrice).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Loan amount</Typography>
            <Typography className={`${style["data"]}`}>
              {(loan.term.amount * currency?.lastPrice).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>{loan.term.apr}%</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until loan expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>
                {prettifySeconds(loanDetails.endTime - Date.now() / 1000)}
              </Typography>
              <LinearProgress variant="determinate" value={10} />
            </Box>
          </Box>
          {canRepay && (
            <Box className="flex fc">
              {!!erc20Allowance &&
                erc20Allowance.gte(loanDetails.amountDueGwei) &&
                !isPending && (
                  <Button variant="contained" onClick={handleRepayLoan}>
                    Repay loan
                  </Button>
                )}
              {(!erc20Allowance || erc20Allowance.lt(loanDetails.amountDueGwei)) &&
                !isPending && (
                  <Button variant="contained" onClick={handleRequestAllowance}>
                    Approve {currency?.symbol} for repayment
                  </Button>
                )}
              {isPending && (
                <Button variant="contained">
                  <CircularProgress color="inherit" />
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerLoanDetails;
