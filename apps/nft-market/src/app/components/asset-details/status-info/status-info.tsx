import { Box, Icon } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import style from "./status-info.module.scss";
import { Asset, Listing, Loan, LoanStatus } from "../../../types/backend-types";
import { useTermDetails } from "../../../hooks/use-term-details";
import { formatCurrency } from "@fantohm/shared-helpers";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrencyByAddress } from "../../../store/selectors/currency-selectors";
import { AppDispatch, RootState } from "../../../store";
import { loadCurrencyFromAddress } from "../../../store/reducers/currency-slice";

export interface StatusInfoProps {
  asset: Asset;
  listing?: Listing;
  loan?: Loan;
}

const ListedInfo = ({
  listing,
  repaymentTotal,
}: {
  listing: Listing;
  repaymentTotal: number;
}): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, listing.term.currencyAddress)
  );
  useEffect(() => {
    dispatch(loadCurrencyFromAddress(listing.term.currencyAddress));
  }, []);
  return (
    <Box className={style["mainContainer"]}>
      <Icon>
        <InfoOutlinedIcon />
      </Icon>
      <Box className={style["textContainer"]}>
        <span className={style["strong"]}>{listing.asset.name} </span>
        <span>is currently listed seeking a loan amount </span>
        <span className={style["strong"]}>
          of {formatCurrency(listing.term.amount * currency?.lastPrice)} in{" "}
          {currency?.symbol}.{" "}
        </span>
        <span>Listing expires </span>
        <span className={style["strong"]}>11:53 PM, 20 July 2022 (GMT +1)</span>
      </Box>
    </Box>
  );
};

const LockedInfo = ({
  loan,
  repaymentTotal,
}: {
  loan: Loan;
  repaymentTotal: number;
}): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, loan.assetListing.term.currencyAddress)
  );
  useEffect(() => {
    dispatch(loadCurrencyFromAddress(loan.assetListing.term.currencyAddress));
  }, []);
  return (
    <Box className={style["mainContainer"]}>
      <Icon>
        <InfoOutlinedIcon />
      </Icon>
      <Box className={style["textContainer"]}>
        <span className={style["strong"]}>{loan.assetListing.asset.name} </span>
        <span>
          is currently being held in escrow in a smart contract and will be released back
          to its borrower if a repayment amount&nbsp;
        </span>
        <span className={style["strong"]}>
          of {formatCurrency(repaymentTotal)} in {currency?.symbol}{" "}
        </span>
        <span>is made before </span>
        <span className={style["strong"]}>11:53 PM, 20 July 2022 (GMT +1)</span>
      </Box>
    </Box>
  );
};

export const StatusInfo = ({ asset, listing, loan }: StatusInfoProps): JSX.Element => {
  const { repaymentTotal } = useTermDetails(listing?.term);

  if (loan && loan.status === LoanStatus.Active) {
    return <LockedInfo loan={loan} repaymentTotal={repaymentTotal} />;
  } else if (!loan && listing) {
    return <ListedInfo listing={listing} repaymentTotal={repaymentTotal} />;
  } else {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
};

export default StatusInfo;
