import { Button, Dialog, Typography } from "@mui/material";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Dispatch, SetStateAction } from "react";

export type ConfirmDialogProps = {
  title: string;
  principal: number;
  platformfee: number;
  currencySymbol: string;
  interest: number;
  duedata: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
};

const ConfirmDialog = (props: ConfirmDialogProps): JSX.Element => {
  const {
    title,
    principal,
    platformfee,
    currencySymbol,
    interest,
    duedata,
    open,
    setOpen,
    onConfirm,
  } = props;
  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>
        <Typography>
          Principal: {principal} {currencySymbol}
        </Typography>
        <Typography>
          Interest: {interest.toFixed(5)} {currencySymbol}
        </Typography>
        <Typography>
          Platform Fee: {platformfee} {currencySymbol}
        </Typography>
        <Typography>
          Total to fund: {principal + platformfee} {currencySymbol}
        </Typography>
        <Typography>
          Total repayment: {(principal + interest).toFixed(5)} {currencySymbol}
        </Typography>
        <Typography>Offer Expires: {duedata}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => setOpen(false)}>
          No
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
