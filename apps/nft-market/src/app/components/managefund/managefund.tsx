import {
  Box,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import style from "./managefund.module.scss";
import { Asset, Listing } from "../../types/backend-types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { selectCurrencyById } from "../../store/selectors/currency-selectors";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { currencyInfo, getSymbolFromAddress } from "../../helpers/erc20Currency";
import {
  requestErc20Allowance,
  useWeb3Context,
  selectErc20BalanceByAddress,
} from "@fantohm/shared-web3";
import { ethers } from "ethers";
import { desiredNetworkId } from "../../constants/network";
export interface ManageFundProps {
  asset: Asset | undefined;
  listing: Listing | null | undefined;
  onClose: (value: boolean) => void;
  open: boolean;
}

export const ManageFund = (props: ManageFundProps): JSX.Element => {
  const { onClose, open } = props;
  const [value, setValue] = React.useState("Deposit");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClose = () => {
    onClose(false);
  };
  const [selectedCurrency, setSelectedCurrency] = useState(
    props.listing ? getSymbolFromAddress(props.listing.term.currencyAddress) : "USDB"
  );
  // currency info
  const currency = useSelector((state: RootState) =>
    selectCurrencyById(state, `${selectedCurrency.toUpperCase()}_ADDRESS`)
  );
  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    setSelectedCurrency(event.target.value);
  };
  const [amount, setAmount] = useState(props?.listing?.term.amount || 10000);
  const handleAmountChange = (event: BaseSyntheticEvent) => {
    setAmount(+event.target.value);
  };
  const { address, chainId, provider } = useWeb3Context();
  const isOwner = useMemo(() => {
    return address.toLowerCase() === props.asset?.owner?.address.toLowerCase();
  }, [props.asset, address]);
  // primary form pending state
  const [pending, setPending] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const {
    checkPermStatus,
    requestPermStatus,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    platformFees,
  } = useSelector((state: RootState) => state.wallet);
  // watch the status of the wallet for pending txns to clear
  useEffect(() => {
    if (
      checkPermStatus !== "loading" &&
      requestPermStatus !== "loading" &&
      requestErc20AllowanceStatus !== "loading" &&
      checkErc20AllowanceStatus !== "loading"
    ) {
      setPending(false);
    } else {
      setPending(true);
    }
  }, [
    checkPermStatus,
    requestPermStatus,
    requestErc20AllowanceStatus,
    checkErc20AllowanceStatus,
  ]);
  // request allowance necessary to create loan with these term
  const handleRequestAllowance = useCallback(() => {
    if (provider && address && props.listing) {
      setPending(true);
      dispatch(
        requestErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: address,
          assetAddress: currency?.currentAddress,
          amount: ethers.utils.parseEther(
            (amount * (1 + platformFees[currency?.currentAddress])).toString()
          ),
        })
      );
    }
  }, [chainId, address, amount, provider, currency]);

  const currencyBalance = useSelector((state: RootState) => {
    if (!currency) return null;
    return selectErc20BalanceByAddress(state, currency?.currentAddress);
  });

  const setMax = () => {
    if (currencyBalance) {
      setAmount(+ethers.utils.formatUnits(currencyBalance, currency?.decimals || 18));
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: "1.5em" }} fullWidth>
      <Box className="flex fr fj-c">
        <h1 style={{ margin: "0 0 0.5em 0" }}>Manage Funds</h1>
      </Box>
      <Box
        className={`flex fr fj-fe ${style["header"]}`}
        sx={{ position: "absolute", right: "16px" }}
      >
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ width: "100%" }}>
        <TabContext value={value}>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: "blue",
              },
            }}
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab value="Deposit" label="Deposit" />
            <Tab value="Withdraw" label="Withdraw" />
          </Tabs>
          <TabPanel value="Deposit" sx={{ height: "350px" }}>
            <Box className="flx">
              <Box className="flex fc">
                <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
                  Select Currency
                </Typography>
                <Box className={`flex`}>
                  <Select
                    value={currency?.symbol}
                    onChange={handleCurrencyChange}
                    sx={{
                      background: "transparent",
                      width: "100%",
                      paddingLeft: "10px",
                      borderRadius: "1.2em",
                      height: "60px",
                    }}
                  >
                    {Object.entries(currencyInfo).map(([tokenId, currencyDetails]) => (
                      <MenuItem
                        value={currencyDetails.symbol}
                        key={`currency-option-item-${tokenId}`}
                        sx={{
                          paddingTop: "2px",
                          paddingBottom: "2px",
                        }}
                      >
                        <Box className="flex fr ai-c">
                          <img
                            style={{ height: "30px", width: "30px", marginRight: "5px" }}
                            src={currencyDetails.icon}
                            alt={`${currencyDetails.symbol} Token Icon`}
                          />
                          <p style={{ fontSize: "16px" }}>
                            {currencyDetails.symbol} - {currencyDetails.name}
                          </p>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
              <Box className="flex fc">
                <Typography sx={{ color: "#aaa", mb: "1em", mt: "1em" }}>
                  Deposit Amount
                </Typography>
                <Box className={`flex fr ai-c ${style["valueContainer"]}`}>
                  <Box className={`flex fr ai-c ${style["leftSide"]}`}>
                    <img
                      style={{ height: "30px", width: "30px", marginRight: "5px" }}
                      src={
                        currencyInfo[`${selectedCurrency.toUpperCase()}_ADDRESS`]?.icon
                      }
                      alt={currencyInfo[`${selectedCurrency.toUpperCase()}_ADDRESS`].icon}
                    />
                    <p style={{ fontSize: "16px" }}>
                      {currencyInfo[`${selectedCurrency.toUpperCase()}_ADDRESS`].symbol}
                    </p>
                  </Box>
                  <Box className={`flex fr ai-c ${style["rightSide"]}`}>
                    <TextField
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{
                        width: "85%",
                      }}
                    />
                    <Typography sx={{ color: "#aaaaaa" }}>
                      <Button
                        variant="text"
                        onClick={setMax}
                        color="primary"
                        sx={{ padding: "none" }}
                      >
                        Max
                      </Button>
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {!isOwner &&
                !pending &&
                props.listing &&
                typeof platformFees[currency?.currentAddress] !== "undefined" && (
                  <Button
                    variant="contained"
                    onClick={handleRequestAllowance}
                    sx={{ width: "100%", mt: 4 }}
                  >
                    Allow Liqd to Access your {currency?.symbol}
                  </Button>
                )}
              {pending && (
                <Button variant="contained" disabled sx={{ width: "100%", mt: 4 }}>
                  Pending...
                </Button>
              )}
            </Box>
          </TabPanel>
          <TabPanel value="Withdraw" sx={{ height: "350px" }}>
            <Box className="flex fc" sx={{ mt: 6 }}>
              <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
                Select Currency
              </Typography>
              <Box className={`flex`}>
                <Select
                  value={currency?.symbol}
                  onChange={handleCurrencyChange}
                  sx={{
                    background: "transparent",
                    width: "100%",
                    paddingLeft: "10px",
                    borderRadius: "1.2em",
                    height: "60px",
                  }}
                  labelId="demo-multiple-name G-label"
                  id="demo-multiple-name"
                >
                  {Object.entries(currencyInfo).map(([tokenId, currencyDetails]) => (
                    <MenuItem
                      value={currencyDetails.symbol}
                      key={`currency-option-item-${tokenId}`}
                      sx={{
                        paddingTop: "2px",
                        paddingBottom: "2px",
                      }}
                    >
                      <Box className="flex fr ai-c">
                        <img
                          style={{ height: "30px", width: "30px", marginRight: "5px" }}
                          src={currencyDetails.icon}
                          alt={`${currencyDetails.symbol} Token Icon`}
                        />
                        <p style={{ fontSize: "16px" }}>
                          {currencyDetails.symbol} - {currencyDetails.name}
                        </p>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Button variant="contained" sx={{ width: "100%", mt: 10 }}>
                Withdraw
              </Button>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Dialog>
  );
};

export default ManageFund;
