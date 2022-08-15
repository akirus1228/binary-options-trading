import {
  AboutDivider,
  NumberImage1,
  NumberImage2,
  NumberImage3,
  NumberImage4,
  preMintImage,
} from "@fantohm/shared/images";
import { Button, Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import style from "./balance_whitelist_mint.module.scss";

/* eslint-disable-next-line */
export interface BalanceWhitelistMintProps {}

export const BalanceWhitelistMintPage = (
  props: BalanceWhitelistMintProps
): JSX.Element => {
  return (
    <Box>
      <Container maxWidth="xl">
        <Grid
          container
          columnSpacing={2}
          rowSpacing={{ xs: 4, md: 0 }}
          sx={{ mt: { md: "100px", xs: "50px" } }}
        >
          <Grid item md={6} xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={preMintImage}
                alt="PreMintPage"
                style={{ width: "100%", border: "1px solid", borderRadius: "25px" }}
              ></img>
            </Box>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "MonumentExtendedRegular",
                fontSize: "45px",
                color: "#dee9ff",
                mt: "5%",
              }}
            >
              Balance Alpha Pass
            </Typography>
            <Typography
              sx={{
                fontFamily: "sequel100black-55",
                fontSize: "19px",
                color: "#8fa0c3",
                letterSpacing: "0.3em",
                mt: "10%",
              }}
            >
              Time until WHITELIST mint
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: "7%" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "MonumentExtendedRegular",
                    fontSize: "64px",
                    color: "#dee9ff",
                  }}
                >
                  00
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "sequel100black-55",
                    fontSize: "14px",
                    color: "#8fa0c3",
                    letterSpacing: "0.3em",
                  }}
                >
                  Days
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "64px",
                  color: "#dee9ff",
                  ml: "4%",
                  mr: "4%",
                }}
              >
                :
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "MonumentExtendedRegular",
                    fontSize: "64px",
                    color: "#dee9ff",
                  }}
                >
                  12
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "sequel100black-55",
                    fontSize: "14px",
                    color: "#8fa0c3",
                    letterSpacing: "0.3em",
                  }}
                >
                  Hours
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "64px",
                  color: "#dee9ff",
                  ml: "4%",
                  mr: "4%",
                }}
              >
                :
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "MonumentExtendedRegular",
                    fontSize: "64px",
                    color: "#dee9ff",
                  }}
                >
                  05
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "sequel100black-55",
                    fontSize: "14px",
                    color: "#8fa0c3",
                    letterSpacing: "0.3em",
                  }}
                >
                  Minutes
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "64px",
                  color: "#dee9ff",
                  ml: "4%",
                  mr: "4%",
                }}
              >
                :
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "MonumentExtendedRegular",
                    fontSize: "64px",
                    color: "#dee9ff",
                  }}
                >
                  45
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "sequel100black-55",
                    fontSize: "14px",
                    color: "#8fa0c3",
                    letterSpacing: "0.3em",
                  }}
                >
                  Seconds
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              href=""
              sx={{
                display: { md: "flex", width: "35%" },
                fontSize: "19px",
                backgroundColor: "#3744e6",
                color: "white",
                fontFamily: "sora",
                mt: "7%",
              }}
              className={style["heroLink"]}
            >
              Connect Wallet
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: { md: "200px", xs: "100px" }, mb: { md: "200px", xs: "100px" } }}>
          <Typography
            sx={{
              fontFamily: "MonumentExtendedRegular",
              fontSize: "45px",
              color: "#dee9ff",
            }}
          >
            How to Mint
          </Typography>
          <Grid
            container
            columnSpacing={2}
            rowSpacing={{ xs: 4, md: 0 }}
            sx={{ mt: { md: "100px", xs: "50px" } }}
          >
            <Grid item md={3} xs={12} sx={{ display: "flex" }}>
              <img
                src={NumberImage1}
                alt="Number1"
                style={{ width: "66px", height: "69px" }}
              ></img>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "23px",
                  color: "#dee9ff",
                  width: "60%",
                  ml: "10%",
                }}
              >
                Connect your Wallet
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sx={{ display: "flex" }}>
              <img
                src={NumberImage2}
                alt="Number2"
                style={{ width: "66px", height: "69px" }}
              ></img>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "23px",
                  color: "#dee9ff",
                  width: "60%",
                  ml: "10%",
                }}
              >
                Press the ‘Mint’ button
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sx={{ display: "flex" }}>
              <img
                src={NumberImage3}
                alt="Number3"
                style={{ width: "66px", height: "69px" }}
              ></img>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "23px",
                  color: "#dee9ff",
                  width: "60%",
                  ml: "10%",
                }}
              >
                Confirm the transaction
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sx={{ display: "flex" }}>
              <img
                src={NumberImage4}
                alt="Number4"
                style={{ width: "66px", height: "69px" }}
              ></img>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "23px",
                  color: "#dee9ff",
                  width: "60%",
                  ml: "10%",
                }}
              >
                Receive your Alpha Pass
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <img src={AboutDivider} alt="Divider" style={{ width: "100%" }} />
    </Box>
  );
};

export default BalanceWhitelistMintPage;
