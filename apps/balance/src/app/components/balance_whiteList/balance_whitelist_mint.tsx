import { addressEllipsis } from "@fantohm/shared-helpers";
import {
  IMintNFTAsyncThunk,
  isDev,
  NetworkIds,
  useWeb3Context,
  allBonds,
  Bond,
  mintNFT,
  isPendingTxn,
  txnButtonText,
  getNFTBalance,
} from "@fantohm/shared-web3";
import {
  AboutDivider,
  DownLine,
  NumberImage1,
  NumberImage2,
  NumberImage3,
  NumberImage4,
  OpenSeaImage,
  preMintImage,
} from "@fantohm/shared/images";
import { ethers } from "ethers";
import { Button, Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { MouseEvent, useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./balance_whitelist_mint.module.scss";
import { whitelist } from "./whitelist";
import { RootState } from "../../store";
import { AsyncThunkAction } from "@reduxjs/toolkit";

/* eslint-disable-next-line */
export interface BalanceWhitelistMintProps {}

export const BalanceWhitelistMintPage = (
  props: BalanceWhitelistMintProps
): JSX.Element => {
  const { connect, disconnect, connected, address, provider, chainId } = useWeb3Context();

  const [balance, setBalance] = useState(0);

  const [bond, setBond] = useState(
    allBonds.filter((bond) => bond.name === "passNFTmint")[0] as Bond
  );

  const dispatch = useDispatch();
  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    connect(true, isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum);
  };
  const onClickDisconnect = () => {
    disconnect();
  };

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });
  const isMintDisabled = useMemo(() => {
    return !whitelist.includes(address);
  }, [address]);

  useEffect(() => {
    if (connected) {
      const getBalance = async (): Promise<any> => {
        try {
          const balance: any = await dispatch(
            getNFTBalance({
              address,
              provider,
              networkId: chainId,
              bond: bond,
            } as IMintNFTAsyncThunk)
          );
          setBalance(350 - ethers.BigNumber.from(balance.payload).toNumber());
        } catch (e) {
          return;
        }
      };

      getBalance();
    }
  }, [connected]);

  const useCountdown = () => {
    const countDownDate = 1661513679000;

    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

    useEffect(() => {
      const interval = setInterval(() => {
        if (countDownDate >= new Date().getTime()) {
          setCountDown(countDownDate - new Date().getTime());
        } else {
          setCountDown(0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
  };

  const getReturnValues = (countDown: any) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
  };

  const [days, hours, minutes, seconds] = useCountdown();

  async function handleMint() {
    dispatch(
      mintNFT({
        address,
        provider,
        networkId: chainId,
        bond: bond,
      } as IMintNFTAsyncThunk)
    );
  }

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
                fontSize: { md: "45px", xs: "40px" },
                color: "#dee9ff",
                mt: "5%",
                textAlign: "center",
              }}
            >
              Balance Alpha Pass
            </Typography>
            <Typography
              sx={{
                fontFamily: "sequel100black-55",
                fontSize: { md: "19px", xs: "18px" },
                color: "#8fa0c3",
                letterSpacing: "0.3em",
                mt: "10%",
                textAlign: "center",
              }}
            >
              {!connected ? "TIME UNTIL WHITELIST MINT" : "WHITELIST MINT"}
            </Typography>
            {!connected ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "7%" }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
                >
                  <Typography
                    sx={{
                      fontFamily: "MonumentExtendedRegular",
                      fontSize: { md: "64px", xs: "30px" },
                      color: "#dee9ff",
                    }}
                  >
                    {days < 10 ? `0${days}` : days}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "sequel100black-55",
                      fontSize: { md: "14px", xs: "8px" },
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
                    fontSize: { md: "64px", xs: "30px" },
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
                      fontSize: { md: "64px", xs: "30px" },
                      color: "#dee9ff",
                    }}
                  >
                    {hours < 10 ? `0${hours}` : hours}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "sequel100black-55",
                      fontSize: { md: "14px", xs: "8px" },
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
                    fontSize: { md: "64px", xs: "30px" },
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
                      fontSize: { md: "64px", xs: "30px" },
                      color: "#dee9ff",
                    }}
                  >
                    {minutes < 10 ? `0${minutes}` : minutes}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "sequel100black-55",
                      fontSize: { md: "14px", xs: "8px" },
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
                    fontSize: { md: "64px", xs: "30px" },
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
                      fontSize: { md: "64px", xs: "30px" },
                      color: "#dee9ff",
                    }}
                  >
                    {seconds < 10 ? `0${seconds}` : seconds}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "sequel100black-55",
                      fontSize: { md: "14px", xs: "8px" },
                      color: "#8fa0c3",
                      letterSpacing: "0.3em",
                    }}
                  >
                    Seconds
                  </Typography>
                </Box>
              </Box>
            ) : balance !== 0 ? (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  mt: "50px",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mr: { md: "10%", xs: "5%" },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "MonumentExtendedRegular",
                      fontSize: { md: "55px", xs: "32px" },
                      color: "#dee9ff",
                    }}
                  >
                    {`${balance}/350`}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "sequel100black-55",
                      fontSize: { md: "14px", xs: "12px" },
                      color: "#8fa0c3",
                      letterSpacing: "0.3em",
                    }}
                  >
                    Remaining
                  </Typography>
                </Box>
                <img
                  src={DownLine}
                  alt="down line"
                  className={style["dropLineSection"]}
                ></img>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    ml: { md: "10%", xs: "5%" },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "MonumentExtendedRegular",
                      fontSize: { md: "55px", xs: "32px" },
                      color: "#dee9ff",
                    }}
                  >
                    Free
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "sequel100black-55",
                      fontSize: { md: "14px", xs: "12px" },
                      color: "#8fa0c3",
                      letterSpacing: "0.3em",
                    }}
                  >
                    Price
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "55px",
                  color: "#dee9ff",
                  mt: "30px",
                  textAlign: "center",
                }}
              >
                SOLD OUT
              </Typography>
            )}

            {!connected ? (
              <Button
                variant="contained"
                onClick={onClickConnect}
                sx={{
                  display: { md: "flex" },
                  width: { md: "35%", xs: "50%" },
                  fontSize: { md: "19px", xs: "14px" },
                  backgroundColor: "#3744e6",
                  color: "white",
                  fontFamily: "sora",
                  mt: { md: "7%", xs: "15%" },
                }}
                className={style["heroLink"]}
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={onClickDisconnect}
                  sx={{
                    display: { md: "flex" },
                    width: { md: "35%", xs: "50%" },
                    fontSize: { md: "19px", xs: "14px" },
                    backgroundColor: "#3744e6",
                    color: "white",
                    fontFamily: "sora",
                    mt: { md: "7%", xs: "15%" },
                  }}
                  className={style["heroLink"]}
                >
                  Disconnect : {addressEllipsis(address)}
                </Button>
                {balance !== 0 ? (
                  <Button
                    variant="contained"
                    disabled={
                      isPendingTxn(pendingTransactions, "Mint_" + bond?.name) ||
                      isMintDisabled
                    }
                    onClick={handleMint}
                    sx={{
                      display: { md: "flex" },
                      width: { md: "35%", xs: "50%" },
                      fontSize: { md: "19px", xs: "14px" },
                      backgroundColor: "#3744e6",
                      color: "white",
                      fontFamily: "sora",
                      mt: { md: "7%", xs: "15%" },
                    }}
                    className={style["heroLink"]}
                  >
                    {txnButtonText(pendingTransactions, "Mint_" + bond?.name, "Mint")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    href="https://Opensea.io"
                    sx={{
                      display: { md: "flex" },
                      width: { md: "40%", xs: "65%" },
                      fontSize: { md: "19px", xs: "14px" },
                      backgroundColor: "#3744e6",
                      color: "white",
                      fontFamily: "sora",
                      mt: { md: "7%", xs: "15%" },
                    }}
                  >
                    <img
                      src={OpenSeaImage}
                      alt="OpenSeaImage"
                      style={{ marginRight: "5%", width: "20%" }}
                    />
                    View on Opensea
                  </Button>
                )}
                {isMintDisabled ? (
                  <Typography
                    sx={{
                      fontFamily: "sora",
                      fontSize: { md: "16px", xs: "12px" },
                      color: "#eb7676",
                      mt: "20px",
                    }}
                  >
                    *ADDRESS NOT WHITELISTED
                  </Typography>
                ) : (
                  ""
                )}
                <Typography
                  sx={{
                    fontFamily: "sora",
                    fontSize: { md: "16px", xs: "12px" },
                    color: "#8fa0c3",
                    width: { md: "52%", xs: "80%" },
                    textAlign: "center",
                    mt: "30px",
                  }}
                >
                  MAX 1 NFT PER WALLET. PRICE 0.00 ETH + GAS WL MINT IS LIVE FOR 10
                  MINUTES
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
        <Box sx={{ mt: { md: "200px", xs: "100px" }, mb: { md: "200px", xs: "100px" } }}>
          <Typography
            sx={{
              fontFamily: "MonumentExtendedRegular",
              fontSize: { md: "45px", xs: "38px" },
              color: "#dee9ff",
              textAlign: "center",
            }}
          >
            How to Mint
          </Typography>
          <Grid
            container
            columnSpacing={2}
            rowSpacing={{ xs: 4, md: 0 }}
            sx={{ mt: { md: "50px", xs: "20px" } }}
          >
            <Grid
              item
              md={3}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center !important",
                mt: { xs: "20px" },
              }}
            >
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
            <Grid
              item
              md={3}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center !important",
                mt: { xs: "20px" },
              }}
            >
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
            <Grid
              item
              md={3}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center !important",
                mt: { xs: "20px" },
              }}
            >
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
            <Grid
              item
              md={3}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center !important",
                mt: { xs: "20px" },
              }}
            >
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
