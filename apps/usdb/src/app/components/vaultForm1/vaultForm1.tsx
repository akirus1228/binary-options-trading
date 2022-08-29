import { Box, TextField, Typography } from "@mui/material";
import style from "./vaultForm1.module.scss";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";


export interface VaultForm1Props {}

export const VaultForm1 = (props: VaultForm1Props): JSX.Element => {
  return (
    <Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            ml: "20px",
            backgroundColor: "black",
            zIndex: "10",
            position: "relative",
            width: "20%",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              color: "#3744E6",
              mr: "5px",
            }}
          >
            *
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              color: "#8a99a8",
            }}
          >
            Vault Name
          </Typography>
        </Box>
        <Box sx={{ mt: "-15px" }}>
          <TextField
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            InputLabelProps={{ style: { fontSize: 40 } }}
            placeholder="Enter Name"
            sx={{
              border: "solid 1px #101112",
              borderRadius: "25px",
              width: "100%",
              padding: "20px 20px",
            }}
          ></TextField>
        </Box>
      </Box>
    </Box>
  );
};

export default VaultForm1;
