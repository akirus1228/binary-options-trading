import { Box, Typography } from "@mui/material";
import { NftPrice } from "../../../types/backend-types";
import NabuLogoImage from "../../../../assets/images/nabu-logo.png";
import InfoImage from "../../../../assets/images/info.png";

export interface PriceInfoProps {
  price: NftPrice;
}

export const PriceInfo = ({ price }: PriceInfoProps): JSX.Element => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <img
          src={NabuLogoImage}
          alt="Nabu Logo"
          style={{ height: "fit-content", margin: "5px" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            style={{
              fontSize: "16px",
              color: "#8991a2",
            }}
          >
            Nabu Valuation
          </Typography>
          <Typography
            style={{
              fontSize: "20px",
            }}
          >
            {parseFloat(price.priceInEth).toFixed(2)} ETH
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          maxWidth: "45%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <img
          src={InfoImage}
          alt="Info"
          style={{ height: "fit-content", marginTop: "2px" }}
        />
        <Typography
          style={{
            fontSize: "12px",
            color: "#8991a2",
            marginLeft: "10px",
          }}
        >
          Data provided by Nabu is for informational purposes only
        </Typography>
      </Box>
    </>
  );
};

export default PriceInfo;
