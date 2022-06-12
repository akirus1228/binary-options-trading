import { addressEllipsis, formatCurrency } from "@fantohm/shared-helpers";
import {
  PaperTable,
  PaperTableCell,
  PaperTableHead,
  PaperTableRow,
} from "@fantohm/shared-ui-themes";
import { useWeb3Context } from "@fantohm/shared-web3";
import {
  Avatar,
  Box,
  Chip,
  LinearProgress,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { desiredNetworkId } from "../../constants/network";
import { useTermDetails } from "../../hooks/use-term-details";
import { AppDispatch, RootState } from "../../store";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import { getLoanDetailsFromContract, LoanDetails } from "../../store/reducers/loan-slice";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { Loan, LoanStatus } from "../../types/backend-types";
// import style from "./my-account.module.scss";

export const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

type MyAccountActiveLoansTableProps = {
  loans: Loan[] | undefined;
};

const LoanRow = ({ loan }: { loan: Loan }): JSX.Element => {
  const { provider } = useWeb3Context();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.backend);
  const { repaymentTotal, repaymentAmount } = useTermDetails(loan.term);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>();

  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, loan.term.currencyAddress)
  );

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(loan.term.currencyAddress));
  }, [loan]);

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

  return (
    <PaperTableRow>
      <PaperTableCell>
        <Avatar
          className="squared"
          alt={loan.assetListing.asset.name || ""}
          src={loan.assetListing.asset.frameUrl || ""}
        />
      </PaperTableCell>
      <PaperTableCell>
        <Link
          to={`/asset/${loan.assetListing.asset.assetContractAddress}/${loan.assetListing.asset.tokenId}`}
        >
          {loan.assetListing.asset.name}
        </Link>
      </PaperTableCell>
      <PaperTableCell>
        <Box className="flex fr ai-c">
          <Tooltip title={`~${formatCurrency(repaymentTotal * currency.lastPrice)}`}>
            <span>{repaymentTotal.toFixed(4)}</span>
          </Tooltip>
          <Tooltip title={currency.name}>
            <img
              src={currency.icon}
              alt={currency.symbol}
              style={{
                height: "20px",
                width: "20px",
                marginLeft: "5px",
                marginBottom: "4px",
              }}
            />
          </Tooltip>
        </Box>
      </PaperTableCell>
      <PaperTableCell>
        <Box className="flex fr ai-c">
          <Tooltip title={`~${formatCurrency(repaymentAmount * currency.lastPrice)}`}>
            <span>{repaymentAmount.toFixed(4)}</span>
          </Tooltip>
          <img
            src={currency.icon}
            alt={currency.symbol}
            style={{
              height: "20px",
              width: "20px",
              marginLeft: "5px",
              marginBottom: "4px",
            }}
          />
        </Box>
      </PaperTableCell>
      <PaperTableCell>{loan.term.apr}%</PaperTableCell>
      <PaperTableCell>{loan.term.duration} days</PaperTableCell>
      <PaperTableCell>{loanDetails?.endDateTime.toLocaleString()}</PaperTableCell>
      <PaperTableCell>
        {loan.borrower.address === user.address
          ? "You"
          : addressEllipsis(loan.borrower.address, 4)}
      </PaperTableCell>
      <PaperTableCell>
        {loan.lender.address === user.address
          ? "You"
          : addressEllipsis(loan.lender.address, 4)}
      </PaperTableCell>
      <PaperTableCell>
        {loan.status === LoanStatus.Active && <Chip label="Escrow" />}
        {loan.status === LoanStatus.Default && <Chip label="Foreclose" />}
        {loan.status === LoanStatus.Complete && <Chip label="Completed" />}
      </PaperTableCell>
    </PaperTableRow>
  );
};

export const MyAccountActiveLoansTable = (
  props: MyAccountActiveLoansTableProps
): JSX.Element => {
  if (typeof props.loans === "undefined") {
    return <LinearProgress />;
  }
  if (props.loans.length < 1) {
    return <></>;
  }
  return (
    <TableContainer>
      <PaperTable aria-label="Active investments">
        <PaperTableHead>
          <TableRow>
            <PaperTableCell>Asset</PaperTableCell>
            <PaperTableCell>Name</PaperTableCell>
            <PaperTableCell>Loan Value</PaperTableCell>
            <PaperTableCell>Repayment</PaperTableCell>
            <PaperTableCell>APR</PaperTableCell>
            <PaperTableCell>Duration</PaperTableCell>
            <PaperTableCell>Due</PaperTableCell>
            <PaperTableCell>Borrower</PaperTableCell>
            <PaperTableCell>Lender</PaperTableCell>
            <PaperTableCell>Status</PaperTableCell>
            <PaperTableCell></PaperTableCell>
          </TableRow>
        </PaperTableHead>
        <TableBody>
          {props.loans.map((loan: Loan, index: number) => (
            <LoanRow loan={loan} key={`ma-invests-table-${index}`} />
          ))}
        </TableBody>
      </PaperTable>
    </TableContainer>
  );
};

export default MyAccountActiveLoansTable;
