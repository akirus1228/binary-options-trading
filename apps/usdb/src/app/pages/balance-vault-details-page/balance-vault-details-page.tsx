import { DaiToken, TakepileLogo } from "@fantohm/shared/images";
import { ContentCopy, NorthEast, OpenInNew } from "@mui/icons-material";
import { Avatar, Box, Button, LinearProgress, Typography } from "@mui/material";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import style from "./balance-vault-details-page.module.scss";
import { PositionTemplate } from "./position-template";

/* eslint-disable-next-line */
export interface BalanceVaultDetailsPageProps {}

export const BalanceVaultDetailsPage = (
  props: BalanceVaultDetailsPageProps
): JSX.Element => {
  const { vaultId } = useParams();
  const themeType = useSelector((state: RootState) => state.app.theme);

  const borderStyle = "2px solid #101112";

  const lowContrastBg =
    themeType === "light"
      ? style["low-contrast-bg-light"]
      : style["low-contrast-bg-light"];

  const lowContrastText =
    themeType === "light"
      ? style["low-contrast-text-light"]
      : style["low-contrast-text-light"];

  return (
    <Box className="flexCenterRow" id="content-centering-container">
      <Box className="grid" sx={{ m: "2em" }} maxWidth="xl" id="grid-container">
        <Box className="rounded-lg" sx={{ border: borderStyle }} id="left-box">
          <Box
            className="flex fr fj-sb ai-c gap-x-2"
            sx={{ borderBottom: borderStyle, p: "2em" }}
            id="left-box-header"
          >
            <Box className="flex fr ai-c">
              <Avatar
                src={TakepileLogo}
                sx={{ p: "5px", border: borderStyle, mr: "1em" }}
              />
              <h2 className={`${style["text-lg"]}`}>Takepile Vault</h2>
            </Box>
            <Box className="flex fr">
              <Button
                variant="contained"
                className="thinSquaredButton"
                sx={{
                  backgroundColor: "#0D1014",
                  color: "#8A99A8",
                }}
              >
                + Deposit
              </Button>
              <Button
                variant="contained"
                className="thinSquaredButton"
                sx={{
                  backgroundColor: "#0D1014",
                  color: "#8A99A859",
                }}
              >
                - Withdraw
              </Button>
            </Box>
          </Box>
          <Box sx={{ p: "2em" }} id="left-box-content">
            <Box
              sx={{ p: "1em" }}
              className={`flex fr ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
            >
              <Box>
                <Typography>Vault Funding</Typography>
                <h2 className={`${style["text-lg"]}`}>$54,521.00 / $100,000.00</h2>
              </Box>
              <Box>
                <Button variant="contained" className="thinButton">
                  Open
                </Button>
              </Box>
            </Box>
            <Box className="grid g-x-3" sx={{ mt: "1em" }}>
              <Box
                sx={{ p: "1em" }}
                className={`flex fc jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
              >
                <span>Vault APR</span>
                <h2 className={style["text-md"]}>30.00%</h2>
              </Box>
              <Box
                sx={{ p: "1em" }}
                className={`flex fc jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
              >
                <span>Lock duration</span>
                <h2 className={style["text-md"]}>120 days</h2>
              </Box>
              <Box
                sx={{ p: "1em" }}
                className={`flex fc jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
              >
                <span>Currencies</span>
                <h2 className={style["text-md"]}>DAI, USDC, USDT</h2>
              </Box>
            </Box>
            <Box className="grid g-x-2">
              <Box>
                <h2 className={style["text-md"]}>Overview</h2>
                <p className={lowContrastText}>
                  Deposit USDC, USDT or DAI to earn from this vault. Funds are locked for
                  120 days once the vault’s desired financing has been met.
                </p>
                <h2 className={style["text-md"]}>Duration</h2>
                <Box className="flex fr jf-sb ai-c">
                  <span>0</span>
                  <LinearProgress
                    value={100}
                    variant="determinate"
                    sx={{ width: "60%" }}
                  />
                  <span>120 days</span>
                </Box>
              </Box>
              <Box className="flex fc fj-sb">
                <Box className="flex fr fj-sb ai-c">
                  <h2 className={style["text-md"]}>My Position</h2>
                  <Typography sx={{ color: "#69D9C8" }}>$0.00</Typography>
                </Box>
                <Box className="flex fr fj-sb ai-c">
                  <span>Asset</span>
                  <span>My position</span>
                </Box>
                <PositionTemplate symbol="DAI" />
                <PositionTemplate symbol="USDC" />
                <PositionTemplate symbol="USDB" />
                <PositionTemplate symbol="USDT" />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="rounded-lg" sx={{ border: borderStyle }} id="right-box">
          <Box
            className="flex fr fj-sb gap-x-2"
            sx={{ borderBottom: borderStyle, p: "2em" }}
            id="right-box-header"
          >
            <h2 className={`${style["text-lg"]}`}>About</h2>
            <Button
              variant="contained"
              className="thinSquaredButton"
              sx={{
                backgroundColor: "#0D1014",
                color: "#8A99A8",
              }}
            >
              + Edit
            </Button>
          </Box>
          <Box sx={{ p: "2em" }}>
            <h2 className={`${style["text-md"]}`}>Description</h2>
            <p className={lowContrastText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a sapien
              magna. Phasellus finibus diam turpis, eu efficitur mi pretium quis. Nunc
              viverra massa ut felis fermentum aliquam. Integer sed ligula vel sapien
              tincidunt feugiat sit amet sed felis. Maecenas volutpat posuere dolor vitae
              laoreet.
            </p>

            <h2 className={`${style["text-md"]}`}>Vault owner</h2>
            <Box
              sx={{ p: "0.75em" }}
              className={`flex fr jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
            >
              <span className={lowContrastText}>
                0x50664edE715e131F584D3E7EaAbd7818Bb20A068
              </span>
              <Box>
                <ContentCopy sx={{ color: "#8A99A8" }} />
                <OpenInNew sx={{ color: "#8A99A8" }} />
              </Box>
            </Box>
            <h2 className={`${style["text-md"]}`}>External Links</h2>
            <Box className="flex fr ai-c gap-x-1">
              <Box
                sx={{ p: "0.75em" }}
                className={`flex fr jf-c ai-c rounded ${lowContrastBg} ${lowContrastText}`}
              >
                Documentation
                <NorthEast />
              </Box>
              <Box
                sx={{ p: "0.75em" }}
                className={`flex fr jf-c ai-c rounded ${lowContrastBg} ${lowContrastText}`}
              >
                Proposal
                <NorthEast />
              </Box>
              <Box
                sx={{ p: "0.75em" }}
                className={`flex fr jf-c ai-c rounded ${lowContrastBg} ${lowContrastText}`}
              >
                Website
                <NorthEast />
              </Box>
              <Box
                sx={{ p: "0.75em" }}
                className={`flex fr jf-c ai-c rounded ${lowContrastBg} ${lowContrastText}`}
              >
                Twitter
                <NorthEast />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BalanceVaultDetailsPage;
