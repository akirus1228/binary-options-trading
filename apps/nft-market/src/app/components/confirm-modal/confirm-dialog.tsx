import { Button, Dialog, Typography } from "@mui/material";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
const ConfirmDialog = (props: any): JSX.Element => {
  const {
    title,
    platformfee,
    currencyConfirm,
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
        <Typography>Principal: {currencyConfirm}</Typography>
        <Typography>
          Interest: {interest.toFixed(3)} {currencyConfirm}
        </Typography>
        <Typography>PlatFormFee: {platformfee}</Typography>
        <Typography>DueData: {duedata}</Typography>
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
