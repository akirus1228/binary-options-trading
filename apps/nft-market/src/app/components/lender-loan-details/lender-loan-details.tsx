import { prettifySeconds, useWeb3Context } from "@fantohm/shared-web3";
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
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateLoanMutation } from "../../api/backend-api";
import { desiredNetworkId } from "../../constants/network";
import store, { RootState } from "../../store";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import {
  forecloseLoan,
  getLoanDetailsFromContract,
  LoanDetails,
} from "../../store/reducers/loan-slice";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { Asset, AssetStatus, Loan, LoanStatus } from "../../types/backend-types";
import style from "./lender-loan-details.module.scss";

/* eslint-disable-next-line */
export interface LenderLoanDetailsProps {
  loan: Loan;
  asset: Asset;
  sx: SxProps<Theme>;
}

type AppDispatch = typeof store.dispatch;

export function LenderLoanDetails({ loan, asset, sx }: LenderLoanDetailsProps) {
  const dispatch: AppDispatch = useDispatch();
  const { provider } = useWeb3Context();
  const [isPending, setIsPending] = useState(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({} as LoanDetails);
  // select logged in user
  const { user } = useSelector((state: RootState) => state.backend);

  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, loan.term.currencyAddress)
  );

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(loan.term.currencyAddress));
  }, []);

  const [updateLoan] = useUpdateLoanMutation();

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

  const handleForecloseLoan = useCallback(async () => {
    if (!loan.contractLoanId || !provider) {
      console.warn("Missing prereqs");
      return;
    }
    setIsPending(true);
    const result = await dispatch(
      forecloseLoan({
        loanId: +loan.contractLoanId,
        provider,
        networkId: desiredNetworkId,
      })
    ).unwrap();

    const updateLoanRequest: Loan = {
      ...loan,
      assetListing: {
        ...loan.assetListing,
        asset: {
          ...loan.assetListing.asset,
          status: AssetStatus.Ready,
          owner: user,
        },
      },
      status: LoanStatus.Default,
    };
    updateLoan(updateLoanRequest);
    setIsPending(false);
  }, [loan, provider]);

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
              {loanDetails.amountDue.toFixed(4)} {currency?.symbol}
            </Typography>
            <Typography className={`${style["data"]} ${style["secondary"]}`}>
              {loanDetails.amountDue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Loan amount</Typography>
            <Typography className={`${style["data"]}`}>
              {loan.term.amount.toFixed(4)} {currency?.symbol}
            </Typography>
            <Typography className={`${style["data"]} ${style["secondary"]}`}>
              {loan.term.amount.toLocaleString("en-US", {
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
          <Box className="flex fc">
            {loanDetails.endTime < Date.now() / 1000 && !isPending && (
              <Button variant="contained" onClick={handleForecloseLoan}>
                Claim NFT
              </Button>
            )}
            {isPending && <Button variant="contained">Pending...</Button>}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderLoanDetails;
