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
import TermsForm from "../terms-form/terms-form";
import style from "./managefund.module.scss";
import { Asset, Listing } from "../../types/backend-types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { selectCurrencyById } from "../../store/selectors/currency-selectors";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { currencyInfo, getSymbolFromAddress } from "../../helpers/erc20Currency";
import { TextFields } from "@mui/icons-material";
import {
  formatCurrency,
  requestErc20Allowance,
  requestNftPermission,
  selectErc20AllowanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { selectNftPermFromAsset } from "../../store/selectors/wallet-selectors";
import { ethers } from "ethers";
import { desiredNetworkId } from "../../constants/network";
import { blue } from "@mui/material/colors";

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
    //do something
    console.log(event.target.value);
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
  // select perm status for this asset from state
  const hasPermission = useSelector((state: RootState) => {
    if (!props.asset) return null;
    return selectNftPermFromAsset(state, props.asset);
  });
  // primary form pending state
  const [pending, setPending] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  // request permission to access the NFT from the contract
  const handlePermissionRequest = useCallback(() => {
    if (
      props.asset &&
      chainId &&
      address &&
      props.asset.assetContractAddress &&
      provider
    ) {
      setPending(true);
      dispatch(
        requestNftPermission({
          networkId: chainId,
          provider,
          walletAddress: address,
          assetAddress: props.asset.assetContractAddress,
          tokenId: props.asset.tokenId,
        })
      );
    } else {
      console.warn("unable to process permission request");
    }
  }, [chainId, address]);
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
  // select the USDB allowance provided to lending contract for this address
  const erc20Allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: address,
      erc20TokenAddress: currency?.currentAddress || "",
    })
  );
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
  console.log("isOwner", isOwner);
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
      <Box
        className={`flex fc ${style["body"]}`}
        sx={{ borderTop: "1px solid #aaaaaa", paddingTop: "1em" }}
      ></Box>
      <TabContext value={value}>
        <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            sx={{ "&.Mui-selected": { backgroundcolor: "blue" } }}
            onChange={handleChange}
            variant="fullWidth"
          >
            <Tab label="Deposit" value="Deposit" />
            <Tab label="Withdraw" value="Withdraw" />
          </Tabs>
        </Box>
        <TabPanel value="Deposit">
          <Box className="flx">
            <Box className="flex fc">
              <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
                Select Currency
              </Typography>
              <Box className={`flex fr ai-c`}>
                <Select
                  value={currency?.symbol}
                  onChange={handleCurrencyChange}
                  sx={{
                    background: "transparent",
                    width: "530px",
                    paddingLeft: "10px",
                    borderRadius: "1.5em",
                  }}
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                >
                  {Object.entries(currencyInfo).map(([tokenId, currencyDetails]) => (
                    <MenuItem
                      value={currencyDetails.symbol}
                      key={`currency-option-item-${tokenId}`}
                    >
                      <Box className="flex fr ai-c">
                        <img
                          style={{ height: "40px", width: "40px", marginRight: "5px" }}
                          src={currencyDetails.icon}
                          alt={`${currencyDetails.symbol} Token Icon`}
                        />
                        <p style={{ fontSize: "20px" }}>{currencyDetails.symbol}</p>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box className="flex fc">
              <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
                Deposit Amount
              </Typography>
              <Box className={`flex fr ai-c`}>
                <TextField
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  sx={{
                    background: "transparent",
                    width: "530px",
                    paddingLeft: "10px",
                    borderRadius: "1.5em",
                  }}
                />
              </Box>
            </Box>
            {!isOwner &&
              !pending &&
              props.listing &&
              typeof platformFees[currency?.currentAddress] !== "undefined" &&
              !!erc20Allowance && (
                <Button variant="contained" onClick={handleRequestAllowance}>
                  Allow Liqd to Access your {currency?.symbol}
                </Button>
              )}
            {pending && (
              <Button variant="contained" disabled>
                Pending...
              </Button>
            )}
          </Box>
        </TabPanel>
        <TabPanel value="Withdraw">Item Two</TabPanel>
      </TabContext>
    </Dialog>
  );
};

export default ManageFund;
