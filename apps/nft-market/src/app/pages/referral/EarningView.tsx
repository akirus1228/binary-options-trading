import { useState } from "react";
import { Box, Button, Grid, Paper, Typography, useMediaQuery } from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import BonusModal from "./BonusModal";
import { ClaimModal } from "./ClaimModal";

export const EarningView = (): JSX.Element => {
  const [bonusModalOpen, setBonusModalOpen] = useState<boolean>(false);
  const [claimModalOpen, setClaimModalOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width:767px)");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          alignItems: isDesktop ? "flex-end" : "flex-start",
          justifyContent: "space-between",
          width: "100%",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <Typography variant="h5" component="h5">
          Earnings
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            component="span"
            style={{
              color: "#7e9aa9",
              fontSize: "14px",
            }}
          >
            Balance Pass Bonus:
          </Typography>
          <Box
            display={"flex"}
            flexDirection={"row"}
            ml="10px"
            alignItems="center"
            sx={{
              bgcolor: "rgba(27,147,133,0.10196078431372549 )",
              padding: "5px 10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => setBonusModalOpen(true)}
          >
            <Typography variant="subtitle2" component="span">
              Active
            </Typography>
            <Box ml={1} display={"flex"}>
              <InfoIcon />
            </Box>
          </Box>
        </Box>
      </Box>
      <Grid container sx={{ marginTop: "30px" }} spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper
            variant="elevation"
            elevation={6}
            sx={{
              width: "100%",
              minHeight: isDesktop ? "200px" : "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: isDesktop ? "flex-start" : "center",
            }}
          >
            <Box display={"flex"} flexDirection={"row"} alignItems="center">
              <Typography variant="subtitle2" component="span">
                Users referred
              </Typography>
              <Box ml={1} display={"flex"}>
                <InfoIcon />
              </Box>
            </Box>
            <Typography style={{ fontSize: "22px" }}>{124}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            variant="elevation"
            elevation={6}
            sx={{
              width: "100%",
              minHeight: isDesktop ? "200px" : "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: isDesktop ? "flex-start" : "center",
            }}
          >
            <Box display={"flex"} flexDirection={"row"} alignItems="center">
              <Typography variant="subtitle2" component="span">
                Total fees earned
              </Typography>
              <Box ml={1} display={"flex"}>
                <InfoIcon />
              </Box>
            </Box>
            <Typography style={{ fontSize: "22px" }}>{"$1,220.39"}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            variant="elevation"
            elevation={6}
            sx={{
              width: "100%",
              minHeight: isDesktop ? "200px" : "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: isDesktop ? "flex-start" : "center",
            }}
          >
            <Box display={"flex"} flexDirection={"row"} alignItems="center">
              <Typography variant="subtitle2" component="span">
                Claimable fees
              </Typography>
              <Box ml={1} display={"flex"}>
                <InfoIcon />
              </Box>
            </Box>
            <Typography style={{ fontSize: "22px" }}>{"$232.84"}</Typography>
            <Button
              variant="contained"
              style={{ marginTop: "10px" }}
              onClick={() => setClaimModalOpen(true)}
            >
              Claim
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <BonusModal open={bonusModalOpen} setOpen={setBonusModalOpen} />
      <ClaimModal open={claimModalOpen} setOpen={setClaimModalOpen} />
    </>
  );
};
