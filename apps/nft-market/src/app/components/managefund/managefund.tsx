import {
  Box,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import React, { BaseSyntheticEvent, useCallback, useEffect, useState } from "react";
import { currencyInfo, getSymbolFromAddress } from "../../helpers/erc20Currency";
import {
  requestErc20Allowance,
  useWeb3Context,
  selectErc20AllowanceByAddress,
  checkErc20Allowance,
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
  const [value] = React.useState("Deposit");

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

  const [amount, setAmount] = useState("0");

  const handleAmountChange = (event: BaseSyntheticEvent) => {
    let value = event.target.value.replace(/-/g, "") || "0";
    const [wholeNumber, fractional] = value.split(".");
    if ((fractional || "").length > currency.decimals) {
      value = wholeNumber + "." + fractional.slice(0, currency.decimals);
    }

    const newAmount = ethers.utils.parseUnits(value, currency.decimals);
    if (newAmount.gt(ethers.constants.MaxUint256)) {
      setMax();
    } else {
      console.log(event.target.value);
      setAmount(value);
    }
  };
  const { address, chainId, provider } = useWeb3Context();
  // primary form pending state
  const [pending, setPending] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const {
    checkPermStatus,
    requestPermStatus,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
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
    if (provider && address) {
      setPending(true);
      dispatch(
        requestErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: address,
          assetAddress: currency?.currentAddress,
          amount: ethers.utils.parseUnits(amount, currency.decimals),
        })
      );
    }
  }, [chainId, address, amount, provider, currency]);

  const currencyAllowance = useSelector((state: RootState) => {
    if (!currency) return null;
    return selectErc20AllowanceByAddress(state, {
      walletAddress: address,
      erc20TokenAddress: currency?.currentAddress,
    });
  });

  console.log(currency, currencyAllowance);

  const setMax = () => {
    setAmount(ethers.utils.formatUnits(ethers.constants.MaxUint256, currency.decimals));
  };

  useEffect(() => {
    if (provider && currency) {
      dispatch(
        checkErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: address,
          assetAddress: currency.currentAddress,
        })
      );
    }
  }, [provider, currency]);

  useEffect(() => {
    if (currencyAllowance && currency) {
      setAmount(ethers.utils.formatUnits(currencyAllowance, currency.decimals));
    }
  }, [currencyAllowance, currency]);

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
          {/* <Tabs
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
          </Tabs> */}
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
                  Allowance
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
              {!pending && (
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
          {/* <TabPanel value="Withdraw" sx={{ height: "350px" }}>
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
          </TabPanel> */}
        </TabContext>
      </Box>
    </Dialog>
  );
};

export default ManageFund;
