import {
  BalanceLiqdLogo,
  BalancePassBanner,
  GenesisNFTPass,
  GoldNFTPass,
  PlatinumNFTPass,
} from "@fantohm/shared/images";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../../components/logo/logo";
import style from "./balance-pass-page.module.scss";

export const BalancePassPage = (): JSX.Element => {
  return (
    <Box
      className={style["passContainer"]}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        paddingTop: { xs: "52px", md: "112px" },
        overflow: "hidden",
      }}
    >
      <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
        <Grid
          item
          sm={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              className={style["heroTitleDivSection"]}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "75%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "45px",
                  fontFamily: "MonumentExtendedRegular",
                  color: "#8A99A8",
                  display: { sm: "22px" },
                }}
                className={style["heroTitle"]}
              >
                Introducing Free
              </Typography>
              <Typography
                sx={{
                  fontSize: "45px",
                  fontFamily: "MonumentExtendedRegular",
                  color: "#DEE9FF",
                }}
                className={style["heroTitle"]}
              >
                Balance Alpha Passes
              </Typography>
            </Box>
            <Typography
              className={style["heroDescription"]}
              sx={{
                fontFamily: "sora",
                color: "#8a99a8",
                textAlign: "center",
                fontSize: "20px",
                mt: "30px",
                width: "70%",
              }}
            >
              Balance is pleased to introduce 350 Alpha NFT Passes for the crypto
              community - allowing special access and perks to our products and services.
              For Free.
            </Typography>
            <Button
              variant="contained"
              sx={{
                display: { md: "flex", width: "35%" },
                fontSize: "19px",
                backgroundColor: "#3744E6",
                color: "white",
                fontFamily: "sora",
                mt: "40px",
              }}
              className={style["heroLink"]}
            >
              Join The Waitlist
            </Button>
          </Box>
        </Grid>
        <Grid item sm={12} md={6}>
          <img
            src={BalancePassBanner}
            alt="BalancePassBanner"
            style={{ width: "100%" }}
            className={style["heroImageSection"]}
          />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
        <Grid item sm={12} md={6} sx={{ display: { xs: "none", md: "flex" } }}>
          <video
            src="/assets/videos/a.mp4"
            autoPlay
            muted
            loop
            style={{ width: "100%" }}
          ></video>
        </Grid>
        <Grid item sm={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "70%" }} className={style["heroTitleDivSection1"]}>
            <Box
              sx={{ textAlign: { xs: "center", sm: "center", md: "left", xl: "left" } }}
            >
              <Typography
                sx={{
                  fontSize: "45px",
                  fontFamily: "MonumentExtendedRegular",
                  color: "#8A99A8",
                }}
                className={style["heroTitle"]}
              >
                Key Benefits to
              </Typography>
              <Typography
                sx={{
                  fontSize: "45px",
                  fontFamily: "MonumentExtendedRegular",
                  color: "#DEE9FF",
                }}
                className={style["heroTitle"]}
              >
                Alpha NFT Holders
              </Typography>
            </Box>
            <Typography
              sx={{
                mt: { xl: "68px", md: "40px", sm: "30px", xs: "20px" },
                textAlign: { xs: "center", sm: "center", md: "left", xl: "left" },
              }}
              className={style["nftHolderDes"]}
            >
              There are many. We will look to implement perks for our pass holders for
              each of our products that Balance Capital produces. In addition, we will
              also allow our partners to offer exclusive perks to our pass holders where
              they see fit.
            </Typography>
            <Typography
              sx={{
                mt: "30px",
                textAlign: { xs: "center", sm: "center", md: "left", xl: "left" },
              }}
              className={style["nftHolderDes"]}
            >
              Additionally, each NFT pass will also serve as a membership ticket to one of
              our Alpha Discord channels enabling the members to apply for early-access/
              whitelist or pre-mint spots for the upcoming crypto projects.
            </Typography>
            <Typography
              sx={{
                mt: "30px",
                textAlign: { xs: "center", sm: "center", md: "left", xl: "left" },
              }}
              className={style["nftHolderDes"]}
            >
              With our new partnership with Triton, we will bring Alpha signals, exposure,
              and other valuable information to the holders of Balance Alpha NFT passes.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box className={style["nftPassSection"]}>
        <Link to="/">
          <img
            src={BalanceLiqdLogo}
            alt="Balance Liqd Logo"
            className={style["balanceLiqdLogoDiv"]}
          />
        </Link>
        <Typography
          sx={{
            width: "42%",
            textAlign: "center",
            fontFamily: "sora",
            fontSize: "20px",
            color: "#8a99a8",
            mt: "50px",
          }}
          className={style["balanceLiqdDes"]}
        >
          Liqdnft.com is one of the most innovative NFT lending and borrowing platforms,
          by the Balance team. By holding Balance Alpha NFTs, investors can save on
          Transactions and systems fees. These perks are broken down below:
        </Typography>
        <Grid
          container
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: "80px",
          }}
          className={style["nftPassTotal"]}
        >
          <Grid
            xs={12}
            md={2}
            sx={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              ml: "100px",
              alignItems: "center",
            }}
            className={style["nftPassInfoSection"]}
          >
            <img src={GenesisNFTPass} alt="GenesisNFT" />
            <Typography
              sx={{
                fontFamily: "MonumentExtendedRegular",
                fontSize: "22px",
                mt: "27px",
                color: "#dee9ff",
              }}
            >
              ‘Genesis’ NFT Pass
            </Typography>
            <Typography
              sx={{
                fontfamily: "sora",
                fontSize: "16px",
                mt: "27px",
                color: "#8a99a8",
                width: "75%",
                textAlign: "center",
              }}
            >
              25% off fees when using the Liqdnft platform
            </Typography>
          </Grid>
          <Grid
            xs={12}
            md={2}
            sx={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              ml: "100px",
              alignItems: "center",
            }}
            className={style["nftPassInfoSection"]}
          >
            <img src={GoldNFTPass} alt="GenesisNFT" />
            <Typography
              sx={{
                fontFamily: "MonumentExtendedRegular",
                fontSize: "22px",
                mt: "27px",
                color: "#dee9ff",
              }}
            >
              ‘Gold’ NFT Pass
            </Typography>
            <Typography
              sx={{
                fontfamily: "sora",
                fontSize: "16px",
                mt: "27px",
                color: "#8a99a8",
                width: "75%",
                textAlign: "center",
              }}
            >
              50% off fees when using the Liqdnft platform
            </Typography>
          </Grid>
          <Grid
            xs={12}
            md={2}
            sx={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              ml: "100px",
              alignItems: "center",
            }}
            className={style["nftPassInfoSection"]}
          >
            <img src={PlatinumNFTPass} alt="GenesisNFT" />
            <Typography
              sx={{
                fontFamily: "MonumentExtendedRegular",
                fontSize: "22px",
                mt: "27px",
                color: "#dee9ff",
              }}
            >
              ‘Platinum’ NFT Pass
            </Typography>
            <Typography
              sx={{
                fontfamily: "sora",
                fontSize: "16px",
                mt: "27px",
                color: "#8a99a8",
                width: "75%",
                textAlign: "center",
              }}
            >
              0.0% off fees when using the Liqdnft platform
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}></Grid>
    </Box>
  );
};

export default BalancePassPage;
