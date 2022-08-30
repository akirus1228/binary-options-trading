import { Box, Grid, LinearProgress, Container, Icon, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import {
  defaultNetworkId,
  getBalanceVaultManager,
  getGeneratedVaultsLength,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { VaultType } from "./vaultType";
import { RootState } from "../../store";

export default function BalanceVault() {
  const { provider, chainId } = useWeb3Context();
  const dispatch = useDispatch();
  const themeType = useSelector((state: RootState) => state.app.theme);

  const [createVaultOpen, setCreateVaultOpen] = useState(false);
  const [vaults, setVaults] = useState<VaultType[]>([]);

  useEffect(() => {
    if (!provider) return;

    setVaults([
      {
        name: "Takepile Vault",
        apr: 30,
        lockPeriod: 120,
        position: 2200,
        duration: 90,
      },
      {
        name: "Takepile Vault",
        apr: 30,
        lockPeriod: 120,
        position: 2200,
        duration: 100,
      },
    ]);

    // dispatch(
    //   getGeneratedVaultsLength({
    //     networkId: chainId ?? defaultNetworkId,
    //     provider: provider,
    //     callback: (result: any) => {
    //       setVaultLength(BigNumber.from(result).toString());
    //     },
    //   })
    // );
  }, [provider]);

  const onCreateVaultOpen = useCallback(() => {
    setCreateVaultOpen(true);
  }, []);
  const onCreateVaultClose = () => {
    setCreateVaultOpen(false);
  };

  return (
    <Container maxWidth="xl">
      <Typography
        sx={{
          fontFamily: "sora",
          fontSize: "35px",
          marginTop: "80px",
        }}
      >
        Portfolio
      </Typography>
      <Typography
        sx={{
          fontFamily: "sora",
          fontSize: "16px",
          color: "#8A99A8",
          marginTop: "30px",
        }}
      >
        Portfolio Value:
      </Typography>
      <Typography
        sx={{
          fontFamily: "sora",
          fontSize: "32px",
          color: "#69D9C8",
          marginTop: "20px",
        }}
      >
        ${3284.99}
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "2px",
          background: themeType === "light" ? "#FFFFFF" : "#101112",
          marginTop: "40px",
          marginBottom: "40px",
        }}
      />
      <Grid container spacing={8}>
        {vaults.map((vault, idx) => (
          <Grid item md={4} xs={12} key={idx}>
            <Box
              sx={{
                borderRadius: "10px",
                padding: "36px 42px",
                background: themeType === "light" ? "#FFFFFF" : "#0A0C0F",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "sora",
                    fontSize: "20px",
                  }}
                >
                  {vault.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  marginTop: "40px",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        fontFamily: "sora",
                        fontSize: "16px",
                        color: "#8A99A8",
                      }}
                    >
                      Vault APR
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "sora",
                        fontSize: "18px",
                        marginTop: "18px",
                      }}
                    >
                      {vault.apr}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        fontFamily: "sora",
                        fontSize: "16px",
                        color: "#8A99A8",
                      }}
                    >
                      Lock duration
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "sora",
                        fontSize: "18px",
                        marginTop: "18px",
                      }}
                    >
                      {vault.lockPeriod} days
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  marginTop: "40px",
                }}
              >
                <Box display="flex">
                  <Typography
                    sx={{
                      fontFamily: "sora",
                      fontSize: "20px",
                    }}
                  >
                    My position
                  </Typography>
                  <Icon
                    component={InfoOutlinedIcon}
                    fontSize={"medium"}
                    sx={{
                      mt: `${"3px"}`,
                      ml: `${"10px"}`,
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "sora",
                    fontSize: "20px",
                    color: "#69D9C8",
                    marginTop: "18px",
                  }}
                >
                  ${vault.position}
                </Typography>
              </Box>
              <Box
                sx={{
                  marginTop: "40px",
                }}
              >
                <Box display="flex">
                  <Typography
                    sx={{
                      fontFamily: "sora",
                      fontSize: "20px",
                    }}
                  >
                    Duration
                  </Typography>
                  <Icon
                    component={InfoOutlinedIcon}
                    fontSize={"medium"}
                    sx={{
                      mt: `${"3px"}`,
                      ml: `${"10px"}`,
                    }}
                  />
                </Box>
                <Box display="flex" alignItems="center" sx={{ marginTop: "10px" }}>
                  <Typography
                    sx={{
                      fontFamily: "sora",
                      fontSize: "16px",
                    }}
                  >
                    {vault.duration}
                  </Typography>
                  <Box sx={{ width: "100px", margin: "0 10px" }}>
                    <LinearProgress
                      variant="determinate"
                      value={(vault.duration / vault.lockPeriod) * 100}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "sora",
                      fontSize: "16px",
                    }}
                  >
                    {vault.lockPeriod} days
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
