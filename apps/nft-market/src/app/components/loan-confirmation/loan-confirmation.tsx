import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AssetStatus,
  BackendLoadingStatus,
  Listing,
  ListingStatus,
  Loan,
  LoanStatus,
} from "../../types/backend-types";
import style from "./loan-confirmation.module.scss";
import { useTermDetails } from "../../hooks/use-term-details";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  checkErc20Allowance,
  loadErc20Balance,
  loadPlatformFee,
  requestErc20Allowance,
  selectErc20AllowanceByAddress,
  selectErc20BalanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { desiredNetworkId } from "../../constants/network";
import { BigNumber, ethers } from "ethers";
import { contractCreateLoan } from "../../store/reducers/loan-slice";
import { useCreateLoanMutation, useGetCollectionsQuery } from "../../api/backend-api";
import { formatCurrency } from "@fantohm/shared-helpers";
import { Link } from "react-router-dom";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { addAlert } from "../../store/reducers/app-slice";
import ConfirmDialog from "../confirm-modal/confirm-dialog";
import { Erc20Currency } from "../../helpers/erc20Currency";

export interface LoanConfirmationProps {
  listing: Listing;
  onClose?: () => void;
}

type CalculatedTermData = {
  amountGwei: BigNumber;
  platformFeeAmtGwei: BigNumber;
  platformFeeAmt: number;
  minRequiredBalanceGwei: BigNumber;
  totalAmt: number;
};

export const LoanConfirmation = ({
  listing,
  onClose,
}: LoanConfirmationProps): JSX.Element => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch: AppDispatch = useDispatch();
  const { provider } = useWeb3Context();

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { repaymentTotal, estRepaymentDate } = useTermDetails(listing.term);
  const { user } = useSelector((state: RootState) => state.backend);
  const { loanCreationStatus } = useSelector((state: RootState) => state.loans);

  const { data: collections, isLoading: isCollectionLoading } = useGetCollectionsQuery({
    contractAddress: listing.asset.assetContractAddress,
  });

  // status of contract calls for allowance and platform fee
  const { checkErc20AllowanceStatus, requestErc20AllowanceStatus, platformFees } =
    useSelector((state: RootState) => state.wallet);

  const handleClose = () => {
    if (onClose) onClose();
    setOpen(false);
  };

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    if (provider && user.address) {
      dispatch(
        loadPlatformFee({
          networkId: desiredNetworkId,
          address: user.address,
          currencyAddress: listing.term.currencyAddress,
        })
      );
    }
  }, [provider, user.address, listing.term.currencyAddress]);

  // currency and allowance info
  const allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: user.address,
      erc20TokenAddress: listing.term.currencyAddress,
    })
  );

  const currency: Erc20Currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, listing.term.currencyAddress)
  );

  // createloan backend api call
  const [createLoan, { isLoading: isCreating, reset: resetCreateLoan }] =
    useCreateLoanMutation();

  const {
    amountGwei,
    platformFeeAmtGwei,
    platformFeeAmt,
    minRequiredBalanceGwei,
    totalAmt,
  }: CalculatedTermData = useMemo(() => {
    if (
      typeof platformFees[listing.term.currencyAddress] === "undefined" ||
      typeof listing === "undefined" ||
      typeof currency === undefined
    )
      return {} as CalculatedTermData;
    const amountGwei = ethers.utils.parseUnits(
      listing.term.amount.toString(),
      currency?.decimals
    );
    const platformFeeAmtGwei: BigNumber = BigNumber.from(
      platformFees[listing.term.currencyAddress]
    )
      .mul(amountGwei)
      .div(10000);
    const minRequiredBalanceGwei = amountGwei.add(platformFeeAmtGwei);
    const platformFeeAmt = +ethers.utils.formatUnits(
      platformFeeAmtGwei,
      currency.decimals
    );
    const totalAmt = listing.term.amount + platformFeeAmt;
    return {
      amountGwei,
      platformFeeAmtGwei,
      platformFeeAmt,
      minRequiredBalanceGwei,
      totalAmt,
    };
  }, [platformFees, listing.term, currency?.decimals]);

  // click accept term button
  const handleAcceptTerms = useCallback(async () => {
    if (!allowance || allowance.lt(minRequiredBalanceGwei)) {
      console.warn("Insufficiant allownace. Trigger request");
      return;
    }
    if (!provider || !user.address || !listing) {
      console.warn("missing critical data");
      return;
    }
    const createLoanRequest: Loan = {
      lender: user,
      borrower: listing.asset.owner,
      assetListing: {
        ...listing,
        status: ListingStatus.Completed,
        asset: { ...listing.asset, status: AssetStatus.Locked },
      },
      term: listing.term,
      status: LoanStatus.Active,
    };

    const createLoanParams = {
      loan: createLoanRequest,
      provider,
      networkId: desiredNetworkId,
    };
    const createLoanResult = await dispatch(
      contractCreateLoan(createLoanParams)
    ).unwrap();
    if (createLoanResult) {
      createLoanRequest.contractLoanId = createLoanResult;
      createLoan(createLoanRequest).then(() => {
        resetCreateLoan();
        dispatch(
          addAlert({
            message:
              "Loan Created. NFT Has been transferred to escrow, and funds transferred to borrower.",
          })
        );
        handleClose();
      });
    }
  }, [listing, provider, listing.asset, allowance, user.address, platformFees]);

  // request allowance necessary to complete txn
  const handleRequestAllowance = useCallback(() => {
    if (
      provider &&
      currency &&
      user.address &&
      typeof minRequiredBalanceGwei !== "undefined"
    ) {
      dispatch(
        requestErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: listing.term.currencyAddress,
          amount: minRequiredBalanceGwei,
        })
      );
    }
  }, [currency, provider, user.address, minRequiredBalanceGwei]);

  // check to see if we have an approval for the amount required for this txn
  useEffect(() => {
    if (user.address && provider) {
      dispatch(
        checkErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: listing.term.currencyAddress,
        })
      );
    }
  }, [user.address, provider]);

  const hasAllowance: boolean = useMemo(() => {
    if (!currency || typeof minRequiredBalanceGwei === "undefined") return false;
    if (
      currency &&
      typeof minRequiredBalanceGwei !== "undefined" &&
      checkErc20AllowanceStatus === "idle" &&
      requestErc20AllowanceStatus === "idle" &&
      !!allowance &&
      allowance.gte(minRequiredBalanceGwei)
    )
      return true;
    return false;
  }, [
    currency,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    allowance,
    minRequiredBalanceGwei,
  ]);

  const isPending = useMemo(() => {
    if (
      isCreating ||
      checkErc20AllowanceStatus === BackendLoadingStatus.loading ||
      requestErc20AllowanceStatus === BackendLoadingStatus.loading ||
      loanCreationStatus === BackendLoadingStatus.loading
    )
      return true;
    return false;
  }, [
    isCreating,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    loanCreationStatus,
  ]);

  const currencyBalance = useSelector((state: RootState) =>
    selectErc20BalanceByAddress(state, currency?.currentAddress)
  );

  useEffect(() => {
    if (!user.address || !currency) return;
    dispatch(
      loadErc20Balance({
        networkId: desiredNetworkId,
        address: user.address,
        currencyAddress: currency.currentAddress,
      })
    );
  }, [user.address, currency]);

  const handleClickLend = () => {
    setOpen(true);
  };
  return (
    <>
      <Button variant="outlined" onClick={handleClickLend}>
        Lend {currency?.symbol}
      </Button>
      <Dialog onClose={handleClose} open={open} fullScreen={isSmall}>
        <Box className="flex fr fj-c">
          <h1 style={{ margin: "0 0 0.5em 0" }}>Loan Details</h1>
        </Box>
        <Box
          className={`flex fr fj-fe ${style["header"]}`}
          sx={{ position: "absolute", right: "16px" }}
        >
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </Box>
        <Box className="flex fc">
          <Paper>
            <Box className="flex fc fj-sb">
              <Box className="flex fc" sx={{ mr: "1em" }}>
                <span className="strong">You are about to lend</span>
                <Box className="flex fr fj-sb ai-c">
                  <span className="flex fr ai-c">
                    <img
                      src={currency?.icon}
                      alt={currency?.name}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "0.25em",
                        marginBottom: "2px",
                      }}
                    />
                    {listing.term.amount} {currency?.symbol}{" "}
                    <span className="subtle" style={{ marginLeft: "1em" }}>
                      (to borrower)
                    </span>
                  </span>
                  <span className="subtle">
                    ~{formatCurrency(listing.term.amount * currency?.lastPrice, 2)}
                  </span>
                </Box>
                <Box className="flex fr fj-sb ai-c">
                  <span className="flex fr ai-c">
                    <img
                      src={currency?.icon}
                      alt={currency?.name}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "0.25em",
                        marginBottom: "2px",
                      }}
                    />
                    {platformFeeAmt}
                    {currency?.symbol}{" "}
                    <span className="subtle" style={{ marginLeft: "1em" }}>
                      (platform fee)
                    </span>
                  </span>
                  <span className="subtle">~{formatCurrency(platformFeeAmt, 2)}</span>
                </Box>
                <span className="strong" style={{ marginTop: "1em" }}>
                  Total
                </span>
                <Box className="flex fr fj-sb ai-c">
                  <span className="flex fr ai-c">
                    <img
                      src={currency?.icon}
                      alt={currency?.name}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "0.25em",
                        marginBottom: "2px",
                      }}
                    />
                    {totalAmt?.toFixed(5)} {currency?.symbol}
                  </span>
                  <span className="subtle">
                    ~{formatCurrency(totalAmt * currency?.lastPrice)}
                  </span>
                </Box>
                <Box
                  className="flex fc"
                  sx={{ borderTop: "1px solid lightgrey", mt: "1em", pt: "1em" }}
                >
                  <span className="strong">My wallet balance</span>
                  <span className="flex fr ai-c">
                    <img
                      src={currency?.icon}
                      alt={currency?.name}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "0.25em",
                        marginBottom: "2px",
                      }}
                    />
                    {currencyBalance &&
                      ethers.utils.formatUnits(
                        currencyBalance,
                        currency?.decimals || 18
                      )}{" "}
                    {currency?.symbol || ""}
                  </span>
                </Box>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ my: "1em" }}>
            <Box className="flex fc" sx={{ mr: "1em" }}>
              <span className="strong">You will recieve repayment of</span>
              <Box className="flex fr fj-sb ai-c">
                <span className="flex fr ai-c">
                  <img
                    src={currency?.icon}
                    alt={currency?.name}
                    style={{
                      height: "20px",
                      width: "20px",
                      marginRight: "0.25em",
                      marginBottom: "2px",
                    }}
                  />
                  {repaymentTotal.toFixed(5)} {currency?.symbol || ""}
                </span>
                <span className="subtle">
                  ~{formatCurrency(repaymentTotal * currency?.lastPrice || 0, 2)}
                </span>
              </Box>
            </Box>
          </Paper>

          <Paper>
            <span className="strong">
              If the loan is not repaid by {estRepaymentDate.toLocaleString()} you are
              entitled to:
            </span>
            <Box className="flex fc" sx={{ mt: "1em" }}>
              <Box className="flex fr ai-c">
                <Link
                  className="flex fr ai-c"
                  to={`/asset/${listing.asset.assetContractAddress}/${listing.asset.tokenId}`}
                >
                  <Avatar src={listing.asset.imageUrl || ""} sx={{ mr: "1em" }} />
                  <Box className="flex fc">
                    <span>{listing.asset.name}</span>
                    <span>
                      {!isCollectionLoading &&
                        collections &&
                        !!collections[0] &&
                        collections[0].name}
                    </span>
                  </Box>
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
        <Box className="flex fr fj-c" sx={{ pt: "2em", pb: "1em" }}>
          {!hasAllowance && !isPending && (
            <Button variant="outlined" onClick={handleRequestAllowance}>
              Allow Liqd access to your {currency?.symbol || ""}
            </Button>
          )}
          {hasAllowance &&
            !isPending &&
            currencyBalance &&
            currencyBalance.gte(listing.term.amount * currency?.decimals || 0) && (
              <Button variant="contained" onClick={() => setConfirmOpen(true)}>
                Lend {currency?.symbol}
              </Button>
            )}
          {hasAllowance &&
            !isPending &&
            currencyBalance &&
            currencyBalance.lt(listing.term.amount * currency?.decimals || 0) && (
              <Button variant="contained" disabled={true}>
                Insufficiant funds
              </Button>
            )}
          {isPending && (
            <Button>
              <CircularProgress />
            </Button>
          )}
        </Box>
        <Box className="flex fr fj-c" onClick={handleClose} sx={{ cursor: "pointer" }}>
          <span className="subtle">Nevermind</span>
        </Box>
        <ConfirmDialog
          title="Confirm Accept terms"
          open={confirmOpen}
          platformfee={platformFees[listing.term.currencyAddress]}
          currencyConfirm={currency?.symbol}
          interest={repaymentTotal}
          duedata={estRepaymentDate.toLocaleString()}
          setOpen={setConfirmOpen}
          onConfirm={handleAcceptTerms}
        ></ConfirmDialog>
      </Dialog>
    </>
  );
};

export default LoanConfirmation;
