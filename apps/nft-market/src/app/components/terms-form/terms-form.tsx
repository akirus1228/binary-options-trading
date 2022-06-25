import {
  checkErc20Allowance,
  checkNftPermission,
  formatCurrency,
  loadPlatformFee,
  requestErc20Allowance,
  requestNftPermission,
  selectErc20AllowanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { AppDispatch, RootState } from "../../store";
import { BaseSyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./terms-form.module.scss";
import {
  Asset,
  AssetStatus,
  Listing,
  Offer,
  OfferStatus,
  Terms,
} from "../../types/backend-types";
import { createListing, updateListing } from "../../store/reducers/listing-slice";
import { selectNftPermFromAsset } from "../../store/selectors/wallet-selectors";
import { signTerms } from "../../helpers/signatures";
import { useCreateOfferMutation, useUpdateTermsMutation } from "../../api/backend-api";
import { ethers } from "ethers";
import { addAlert } from "../../store/reducers/app-slice";
import { currencyInfo, getSymbolFromAddress } from "../../helpers/erc20Currency";
import { desiredNetworkId } from "../../constants/network";
import { selectCurrencyById } from "../../store/selectors/currency-selectors";
import { loadCurrencyFromId } from "../../store/reducers/currency-slice";

export interface TermsFormProps {
  asset: Asset;
  listing?: Listing;
  onClose: (value: boolean) => void;
}

export type TermTypes = {
  [key: string]: number;
};

export const termTypes: TermTypes = {
  days: 1,
  weeks: 7,
  months: 30,
};

export const TermsForm = (props: TermsFormProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { address, chainId, provider } = useWeb3Context();
  // update term backend api call
  const [
    updateTerms,
    {
      isLoading: isTermsUpdateLoading,
      data: updateTermsResponse,
      reset: updateTermsReset,
    },
  ] = useUpdateTermsMutation();
  // primary form pending state
  const [pending, setPending] = useState(false);
  // primary term variables
  const [duration, setDuration] = useState(props?.listing?.term.duration || 1);
  const [durationType, setDurationType] = useState("days");
  const [apr, setApr] = useState(props?.listing?.term.apr || 25);
  const [amount, setAmount] = useState(props?.listing?.term.amount || 10000);
  const [repaymentAmount, setRepaymentAmount] = useState(2500);
  const [selectedCurrency, setSelectedCurrency] = useState(
    props.listing ? getSymbolFromAddress(props.listing.term.currencyAddress) : "USDB"
  );

  // currency info
  const currency = useSelector((state: RootState) =>
    selectCurrencyById(state, `${selectedCurrency.toUpperCase()}_ADDRESS`)
  );

  useEffect(() => {
    dispatch(loadCurrencyFromId(`${selectedCurrency.toUpperCase()}_ADDRESS`));
  }, [selectedCurrency]);

  // create offer api call
  const [
    createOffer,
    {
      isLoading: isCreateOfferLoading,
      data: createOfferResponse,
      reset: createOfferReset,
    },
  ] = useCreateOfferMutation();
  // select logged in user
  const { user } = useSelector((state: RootState) => state.backend);
  // nft permission status updates from state
  const {
    checkPermStatus,
    requestPermStatus,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    platformFees,
  } = useSelector((state: RootState) => state.wallet);
  // select perm status for this asset from state
  const hasPermission = useSelector((state: RootState) =>
    selectNftPermFromAsset(state, props.asset)
  );

  // select the USDB allowance provided to lending contract for this address
  const erc20Allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: address,
      erc20TokenAddress: currency?.currentAddress || "",
    })
  );

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    if (provider && address && currency && currency?.currentAddress) {
      dispatch(
        loadPlatformFee({
          networkId: desiredNetworkId,
          address,
          currencyAddress: currency?.currentAddress,
        })
      );
    }
  }, [provider, address, currency?.currentAddress]);

  // request permission to access the NFT from the contract
  const handlePermissionRequest = useCallback(() => {
    if (chainId && address && props.asset.assetContractAddress && provider) {
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
  }, [chainId, address, props.asset.assetContractAddress]);

  // check the contract to see if we have perms already
  useEffect(() => {
    if (chainId && address && props.asset.assetContractAddress && provider && isOwner) {
      dispatch(
        checkNftPermission({
          networkId: chainId,
          provider,
          walletAddress: address,
          assetAddress: props.asset.assetContractAddress,
          tokenId: props.asset.tokenId,
        })
      );
    }
  }, [chainId, address, props.asset.assetContractAddress]);

  // check to see if we have an approval for the amount required for this txn
  useEffect(() => {
    if (user.address && provider && currency && !erc20Allowance) {
      dispatch(
        checkErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: currency.currentAddress,
        })
      );
    }
  }, [user.address, provider, currency, erc20Allowance]);

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

  const isOwner = useMemo(() => {
    return address.toLowerCase() === props.asset?.owner?.address.toLowerCase();
  }, [props.asset, address]);

  const handleCreateListing = async () => {
    if (!provider || !chainId) return;
    // send listing data to backend
    setPending(true);
    let asset: Asset;
    if (props.asset.status === AssetStatus.New) {
      asset = { ...props.asset, owner: user };
    } else {
      asset = { ...props.asset, status: AssetStatus.Listed };
    }
    const expirationAt = new Date(Date.now() + 86400 * 1000 * 7);
    const term: Terms = {
      amount,
      apr,
      duration,
      expirationAt: expirationAt.toJSON(),
      signature: "",
      currencyAddress: currency?.currentAddress,
    };
    const termSignature = await signTerms(
      provider,
      asset.owner?.address || "",
      chainId,
      asset.assetContractAddress,
      asset.tokenId,
      term,
      currency,
      dispatch
    );
    term.signature = termSignature;
    if (term.signature) {
      dispatch(createListing({ term, asset })).then(() => {
        dispatch(addAlert({ message: "Listing created" }));
        props.onClose(true);
      });
    } else {
      setPending(false);
    }
    return;
  };

  const handleUpdateTerms = async () => {
    if (!provider || !chainId || !props.listing) return;
    // send listing data to backend
    setPending(true);
    let asset: Asset;
    if (props.asset.status === AssetStatus.New) {
      asset = { ...props.asset, owner: user };
    } else {
      asset = props.asset;
    }
    const expirationAt = new Date(Date.now() + 86400 * 1000 * 7);
    const term: Terms = {
      ...props?.listing?.term,
      amount,
      apr,
      duration: termTypes[durationType] * duration,
      expirationAt: expirationAt.toJSON(),
      signature: "",
      currencyAddress: currency?.currentAddress,
    };
    const termSignature = await signTerms(
      provider,
      asset.owner?.address || "",
      chainId,
      asset.assetContractAddress,
      asset.tokenId,
      term,
      currency,
      dispatch
    );
    term.signature = termSignature;
    updateTerms(term);
    dispatch(addAlert({ message: "Terms have been updated." }));
    return;
  };

  useEffect(() => {
    if (
      !isTermsUpdateLoading &&
      typeof updateTermsResponse !== "undefined" &&
      props.listing
    ) {
      dispatch(updateListing({ ...props.listing, term: updateTermsResponse }));
    }
    if (!isTermsUpdateLoading && updateTermsResponse) {
      updateTermsReset();
      props.onClose(true);
    }
  }, [isTermsUpdateLoading, updateTermsResponse, props.listing]);

  const handleDurationChange = (event: BaseSyntheticEvent) => {
    const value = Math.floor(+event.target.value);
    setDuration(value === 0 ? 1 : value);
  };

  const handleDurationTypeChange = (event: SelectChangeEvent) => {
    if (!["days", "weeks", "months"].includes(event.target.value)) {
      console.warn("invalid duration type");
      return;
    }
    setDurationType(event.target.value);
  };

  const handleAprChange = (event: BaseSyntheticEvent) => {
    setApr(+event.target.value);
  };

  const handleAmountChange = (event: BaseSyntheticEvent) => {
    const amount = Math.floor(+event.target.value);
    setAmount(amount === 0 ? 1 : amount);
  };

  // calculate repayment totals
  useEffect(() => {
    const wholePercent = ((termTypes[durationType] * duration) / 365) * apr;
    const realPercent = wholePercent / 100;
    const _repaymentAmount = amount * realPercent;
    setRepaymentAmount(_repaymentAmount);
    //setRepaymentTotal(_repaymentAmount + amount);
  }, [durationType, duration, amount, apr]);

  // make offer logic
  const handleMakeOffer = useCallback(async () => {
    if (!props.listing || !provider || !props.asset.owner) return;
    const expirationAt = new Date(Date.now() + 86400 * 1000 * 7);
    const { id, ...listingTerm } = props.listing.term;
    const preSigTerm: Terms = {
      ...listingTerm,
      amount: amount,
      duration: termTypes[durationType] * duration,
      apr: apr,
      expirationAt: expirationAt.toJSON(),
      signature: "",
      currencyAddress: currency?.currentAddress,
    };

    const signature = await signTerms(
      provider,
      props.listing.asset.wallet || "",
      desiredNetworkId,
      props.asset.assetContractAddress,
      props.asset.tokenId,
      preSigTerm,
      currency,
      dispatch
    );
    if (!signature) return;

    const term: Terms = {
      ...preSigTerm,
      signature,
    };

    const offer: Offer = {
      lender: user,
      assetListing: props.listing,
      term,
      status: OfferStatus.Ready,
    };
    createOffer(offer);
    dispatch(addAlert({ message: "Offer sent" }));
  }, [props.listing, provider, props.asset, amount, duration, apr, currency]);

  useEffect(() => {
    if (!isCreateOfferLoading && !!createOfferResponse) {
      createOfferReset();
      props.onClose(true);
    }
  }, [isCreateOfferLoading, createOfferResponse]);

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

  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    //do something
    console.log(event.target.value);
    setSelectedCurrency(event.target.value);
  };

  return (
    <Box className="flex fc" sx={{ padding: "1em" }}>
      <Box className="flex fc">
        <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
          How much would you like to borrow?
        </Typography>
        <Box className={`flex fr ai-c ${style["valueContainer"]}`}>
          <Box className={`flex fr ai-c ${style["leftSide"]}`}>
            <Select
              value={currency?.symbol}
              onChange={handleCurrencyChange}
              variant="standard"
              sx={{ background: "transparent" }}
              className="borderless"
            >
              {Object.entries(currencyInfo).map(([tokenId, currencyDetails]) => (
                <MenuItem
                  value={currencyDetails.symbol}
                  key={`currency-option-item-${tokenId}`}
                >
                  <Box className="flex fr ai-c">
                    <img
                      style={{ height: "28px", width: "28px", marginRight: "5px" }}
                      src={currencyDetails.icon}
                      alt={`${currencyDetails.symbol} Token Icon`}
                    />
                    {currencyDetails.symbol}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box className={`flex fr ${style["rightSide"]}`}>
            <TextField
              type="number"
              value={amount}
              onChange={handleAmountChange}
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
            />
            <Typography sx={{ color: "#aaaaaa" }}>
              {!!currency && formatCurrency(amount * currency?.lastPrice, 2)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="flex fc" sx={{ my: "1em" }}>
        <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>Set loan duration</Typography>
        <Box className={`flex fr ${style["valueContainer"]}`}>
          <Box className={`flex fr ai-c ${style["leftSide"]}`}>
            <Select
              value={durationType}
              onChange={handleDurationTypeChange}
              variant="standard"
              sx={{ background: "transparent" }}
              className="borderless"
            >
              <MenuItem value="days">Days</MenuItem>
              <MenuItem value="weeks">Weeks</MenuItem>
              <MenuItem value="months">Months</MenuItem>
            </Select>
          </Box>
          <Box className={`flex fr fj-fs ${style["rightSide"]}`}>
            <TextField
              value={duration}
              type="number"
              onChange={handleDurationChange}
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box className="flex fc" sx={{ mt: "1em", mb: "2em" }}>
        <Box className="flex fj-sb" sx={{ color: "#aaaaaa", mb: "0.5em" }}>
          <Typography>Set repayment APR</Typography>
          <Typography sx={{ fontSize: "smaller", color: "#000" }}>
            Repayment Amount:
          </Typography>
        </Box>
        <Box className={`flex fr ${style["valueContainer"]}`}>
          <Box className={`flex fr ai-c ${style["leftSide"]}`}>APR</Box>
          <Box className={`flex fr ${style["rightSide"]}`}>
            <Box className="flex fr" component="div">
              <TextField
                value={apr}
                type="number"
                onChange={handleAprChange}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Box>
            <Box
              className="flex ai-c"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                color: "#aaaaaa",
                width: "150px",
                paddingLeft: "10px",
              }}
            >
              {formatCurrency(repaymentAmount * currency?.lastPrice, 2)}
            </Box>
          </Box>
        </Box>
      </Box>
      {isOwner && !hasPermission && !pending && (
        <Button variant="contained" onClick={handlePermissionRequest}>
          Allow Liqd to Access your NFT
        </Button>
      )}
      {isOwner && hasPermission && !pending && !props.listing && (
        <Button variant="contained" onClick={handleCreateListing}>
          List as collateral
        </Button>
      )}
      {isOwner && hasPermission && !pending && props.listing && (
        <Button variant="contained" onClick={handleUpdateTerms}>
          Update Terms (no cost)
        </Button>
      )}
      {!isOwner &&
        !pending &&
        props.listing &&
        !!erc20Allowance &&
        typeof platformFees[currency?.currentAddress] !== "undefined" &&
        erc20Allowance.gte(
          ethers.utils.parseEther(
            (amount * (1 + platformFees[currency?.currentAddress])).toString()
          )
        ) && (
          <Button variant="contained" onClick={handleMakeOffer}>
            Make Offer
          </Button>
        )}
      {!isOwner &&
        !pending &&
        props.listing &&
        typeof platformFees[currency?.currentAddress] !== "undefined" &&
        !!erc20Allowance &&
        erc20Allowance.lt(
          ethers.utils.parseEther(
            (amount * (1 + platformFees[currency?.currentAddress])).toString()
          )
        ) && (
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
  );
};

export default TermsForm;
