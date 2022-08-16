import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import HeroBannerImg from "../../../assets/images/hero-banner.png";
import HeroBannerMobileImg from "../../../assets/images/hero-banner-mobile.png";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const HeroBanner = (): JSX.Element => {
  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: "-1",
        top: "0",
        left: "0",
        width: "100%",
        backgroundImage: {
          xs: `url('${HeroBannerMobileImg}')`,
          sm: `url('${HeroBannerImg}')`,
        },
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          height: "1080px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "31px", xl: "50px" },
            width: "80%",
            textAlign: "center",
            fontFamily: "MonumentExtended",
            color: "#E6EDFF",
          }}
        >
          Unlock the value of your NFTs, without selling
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "16px", xl: "20px" },
            marginTop: "20px",
            width: "80%",
            textAlign: "center",
            fontFamily: "inter",
            color: "#8FA0C3",
          }}
        >
          Unlock the value of your NFTs, without selling
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <NavLink to="/borrow">
            <Button
              sx={{
                width: "310px",
                height: { xs: "68px", xl: "76px" },
                border: "2px solid #374FFF",
                borderRadius: "50px",
                fontFamily: "inter",
                fontSize: { xs: "14px", xl: "18px" },
              }}
            >
              Borrow
            </Button>
          </NavLink>
          <NavLink to="/lend">
            <Button
              sx={{
                width: "310px",
                height: { xs: "68px", xl: "76px" },
                border: "2px solid #374FFF",
                borderRadius: "50px",
                fontFamily: "inter",
                fontSize: { xs: "14px", xl: "18px" },
              }}
            >
              Lend
            </Button>
          </NavLink>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroBanner;
