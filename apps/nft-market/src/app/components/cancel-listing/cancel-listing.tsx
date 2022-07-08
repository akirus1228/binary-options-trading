import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "@fantohm/shared-web3";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AssetStatus, Listing } from "../../types/backend-types";
import { useDeleteListingMutation } from "../../api/backend-api";
import { AppDispatch, RootState } from "../../store";
import { selectNftPermFromAsset } from "../../store/selectors/wallet-selectors";
import { addAlert } from "../../store/reducers/app-slice";
import { updateAsset } from "../../store/reducers/asset-slice";
import style from "./cancel-listing.module.scss";
import { deleteListing } from "../../store/reducers/listing-slice";

export interface CancelListingProps {
  listing: Listing;
  onClose: (value: boolean) => void;
  open: boolean;
}

export const CancelListing = (props: CancelListingProps): JSX.Element => {
  const { onClose, open } = props;

  const dispatch: AppDispatch = useDispatch();
  const { address, chainId, provider } = useWeb3Context();
  // update term backend api call
  const [
    deleteListingApi,
    {
      isLoading: isDeleteListingLoading,
      data: deleteListingResponse,
      reset: deleteListingReset,
    },
  ] = useDeleteListingMutation();
  // primary form pending state
  const [pending, setPending] = useState(false);

  const isOwner = useMemo(() => {
    return address.toLowerCase() === props.listing.asset?.owner?.address.toLowerCase();
  }, [props.listing.asset, address]);

  // nft permission status updates from state
  const {
    checkPermStatus,
    requestPermStatus,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
  } = useSelector((state: RootState) => state.wallet);

  // select perm status for this asset from state
  const hasPermission = useSelector((state: RootState) =>
    selectNftPermFromAsset(state, props.listing.asset)
  );

  const handleClose = () => {
    onClose(false);
  };

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

  const handleCancelListing = async () => {
    if (!provider || !chainId || !props.listing) return;
    // send listing data to backend
    setPending(true);
    deleteListingApi(props.listing);
    dispatch(addAlert({ message: "Listing has been cancelled." }));
    return;
  };

  useEffect(() => {
    if (
      !isDeleteListingLoading &&
      typeof deleteListingResponse !== "undefined" &&
      props.listing
    ) {
      dispatch(updateAsset({ ...props.listing.asset, status: AssetStatus.New }));
      dispatch(deleteListing(props.listing));
    }
    if (!isDeleteListingLoading && deleteListingResponse) {
      deleteListingReset();
      props.onClose(true);
    }
  }, [isDeleteListingLoading, deleteListingResponse, props.listing]);

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: "1.5em" }} fullWidth>
      <Box className="flex fr fj-c">
        <h1 style={{ margin: "0 0 0.5em 0" }}>Cancel listing</h1>
      </Box>
      <Box
        className={`flex fr fj-fe ${style["header"]}`}
        sx={{ position: "absolute", right: "16px" }}
      >
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <Box className={`flex fc ${style["body"]}`} sx={{ borderTop: "1px solid #aaaaaa" }}>
        <Box className="flex fc" sx={{ padding: "1em" }}>
          <Box className="flex fc" sx={{ padding: "1em" }}>
            <Typography>Do you want to cancel listing?</Typography>
          </Box>
          {isOwner && hasPermission && !pending && props.listing && (
            <Button variant="contained" onClick={handleCancelListing}>
              Cancel Listing (no cost)
            </Button>
          )}
          {pending && (
            <Button variant="contained" disabled>
              <CircularProgress />
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default CancelListing;
