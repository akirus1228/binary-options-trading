import { Box, Button, Dialog, IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import style from "./list-as-collateral.module.scss";
import { useState } from "react";
import { TermsForm } from "../../terms-form/terms-form";
import { Asset } from "../../../types/backend-types";

export interface ListAsCollateralProps {
  open: boolean;
  asset: Asset;
  onClose: (value: boolean) => void;
}

export enum DialogState {
  DISCLAIMER,
  TERMS,
}

export const ListAsCollateral = (props: ListAsCollateralProps): JSX.Element => {
  const [dialogState, setDialogState] = useState<DialogState>(DialogState.DISCLAIMER);
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(false);
    // resetting state displays content before the window rerenders.
    // Adding timeout so user doesn't see it.
    setTimeout(() => {
      setDialogState(DialogState.DISCLAIMER);
    }, 300);
  };

  const DisclaimerComponent = (): JSX.Element => {
    return (
      <>
        <ul>
          <li>By continuing, you agree and accept the below terms and conditions.</li>
          <li>
            You agree and accept to grant Liqd the full management and control access to
            your NFT posted as collateral.
          </li>
          <li>
            You agree and accept to pay the full interest amount on the acquired loan even
            when its repayment is completed within the agreed upon terms.
          </li>
          <li>
            You agree and accept to repay the loan with interest only with the wallet
            address used to sign the loan contract.
          </li>
          <li>
            You agree and accept that the lender becomes the sole owner of your NFT should
            your loan has been defaulted on.
          </li>
          <li>
            You agree and accept that you cannot repay any loans and negotiate new loan
            terms after the loans have been defaulted on.
          </li>
        </ul>
        <Button onClick={onAcceptTerms} variant="contained">
          Accept & continue
        </Button>
      </>
    );
  };

  const onAcceptTerms = () => {
    setDialogState(DialogState.TERMS);
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: "1.5em" }} fullWidth>
      <Box className="flex fr fj-c">
        <h1 style={{ margin: "0 0 0.5em 0" }}>Get liquidity</h1>
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
      >
        {dialogState === DialogState.DISCLAIMER && <DisclaimerComponent />}
        {dialogState === DialogState.TERMS && (
          <TermsForm
            asset={props.asset}
            onClose={onClose}
            key={`list-terms-${props.asset.openseaId}`}
            type="borrow"
          />
        )}
      </Box>
    </Dialog>
  );
};

export default ListAsCollateral;
