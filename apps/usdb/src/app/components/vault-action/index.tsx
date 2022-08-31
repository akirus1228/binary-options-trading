import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Dialog,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import styles from "./style.module.scss";
import { USDBToken } from "@fantohm/shared/images";
import { currencyInfo } from "@fantohm/shared-web3";
import FormInputWrapper from "../formInputWrapper";
import { RootState } from "../../store";

export interface VaultActionProps {
  onClose: (value: boolean) => void;
  deposit: boolean;
  open: boolean;
}

export const VaultActionForm = (props: VaultActionProps): JSX.Element => {
  const { onClose, open, deposit } = props;

  const [isDeposit, setIsDeposit] = useState(deposit);
  const [token, setToken] = useState("USDB");

  const themeType = useSelector((state: RootState) => state.app.theme);

  useEffect(() => {
    if (open) {
      setIsDeposit(deposit);
    }
  }, [open]);

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
        <Box
          className={styles["tapButton"]}
          onClick={() => setIsDeposit(true)}
          sx={{
            borderBottom: `${
              isDeposit
                ? `solid 3px ${themeType === "light" ? "black" : "white"}`
                : "none"
            }`,
          }}
        >
          Deposit
        </Box>
        <Box
          className={styles["tapButton"]}
          onClick={() => setIsDeposit(false)}
          sx={{
            borderBottom: `${
              isDeposit
                ? "none"
                : `solid 3px ${themeType === "light" ? "black" : "white"}`
            }`,
          }}
        >
          Withdraw
        </Box>
      </Box>
      <Box
        className={`flex fc ${styles["body"]}`}
        sx={{ borderTop: "1px solid #aaaaaa", paddingTop: "40px" }}
      >
        <FormInputWrapper title="My wallet">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box
              className="flex fr ai-c"
              sx={{
                padding: "10px 20px",
                border: "1px solid #101112",
                borderRadius: "10px",
              }}
            >
              <Select
                value={token}
                onChange={(e) => setToken(e.target.value)}
                variant="standard"
                sx={{ background: "transparent" }}
                className="borderless"
                disableUnderline
              >
                {Object.entries(currencyInfo).map(([tokenId, currencyDetails]) => (
                  <MenuItem
                    value={currencyDetails.symbol}
                    key={`currency-option-item-${tokenId}`}
                  >
                    <Box className="flex fr ai-c">
                      <img
                        style={{ height: "26px", width: "26px", marginRight: 10 }}
                        src={currencyDetails.icon}
                        alt={`${currencyDetails.symbol} Token Icon`}
                      />
                      <Typography sx={{ fontSize: 16 }}>
                        {currencyDetails.symbol}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <TextField
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: {
                  flexGrow: 1,
                  fontSize: "30px",
                },
              }}
              inputProps={{ style: { textAlign: "right" } }}
              sx={{
                width: "100%",
                marginLeft: "20px",
              }}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginTop: "30px", fontSize: "18px", color: "#8A99A8" }}
          >
            <Typography>Wallet balance: 100,000.00</Typography>
            <Typography>$29,988.99</Typography>
          </Box>
        </FormInputWrapper>
        <FormInputWrapper title="Estimated yield" className={styles["inputWrapper"]}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box
              className="flex fr ai-c"
              sx={{
                padding: "10px 20px",
                border: "1px solid #101112",
                borderRadius: "10px",
              }}
            >
              <img
                style={{ height: "26px", width: "26px", marginRight: 10 }}
                src={USDBToken}
                alt="USDB Token Icon"
              />
              <Typography sx={{ fontSize: 16 }}>USDB</Typography>
            </Box>
            <Typography sx={{ fontSize: 30, color: "#8A99A8" }}>9,000.00</Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginTop: "30px", fontSize: "18px", color: "#8A99A8" }}
          >
            <Box display="flex">
              <Typography>Yield:&nbsp;</Typography>
              <Typography sx={{ color: "#69D9C8" }}>30%</Typography>
            </Box>
            <Typography>$8,999.99</Typography>
          </Box>
        </FormInputWrapper>
        <Button sx={{ marginTop: "30px" }} className={styles["button"]}>
          {isDeposit ? "Deposit" : "Withdraw"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default VaultActionForm;
