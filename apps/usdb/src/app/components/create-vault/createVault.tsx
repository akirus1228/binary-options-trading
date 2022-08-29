import { Box, Dialog, IconButton, Typography } from "@mui/material";
import style from "./createVault.module.scss";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VaultForm1 from "../vaultForm1/vaultForm1";

export interface CreateVaultProps {
  onClose: (value: boolean) => void;
  open: boolean;
}

export const CreateVaultForm = (props: CreateVaultProps): JSX.Element => {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          background: "black",
          border: "1px solid #101112",
          maxWidth: "800px",
        },
      }}
      sx={{ padding: "3em" }}
      fullWidth
    >
      <Box className="flex fr fj-c" sx={{ display: "flex", justifyContent: "center" }}>
        <h1 style={{ margin: "0 0 0.5em 0" }}>Create Vault</h1>
      </Box>
      <Box
        className={`flex fr fj-fe ${style["header"]}`}
        sx={{ position: "absolute", right: "16px" }}
      >
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon htmlColor="grey" fontSize="large" />
        </IconButton>
      </Box>
      <Box
        className={`flex fc ${style["body"]}`}
        sx={{ borderTop: "1px solid #aaaaaa", paddingTop: "1em" }}
      >
        <VaultForm1 />
      </Box>
    </Dialog>
  );
};

export default CreateVaultForm;
