import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import {
  defaultNetworkId,
  getBalances,
  setWalletConnected,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { EarningView } from "./EarningView";
import { ReferralList } from "./ReferralList";
import { copyToClipboard } from "@fantohm/shared-helpers";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAlert, GrowlNotification } from "../../store/reducers/app-slice";

export const Referral = (): JSX.Element => {
  const { address, chainId, connected, disconnect, connect } = useWeb3Context();
  const dispatch = useDispatch();

  const isDesktop = useMediaQuery("(min-width:767px)");
  const referralCode = "https://liqdnft.com/?ref=0x43Fe...24d1c";

  const handleConnect = useCallback(async () => {
    if (connected) {
      await disconnect();
    } else {
      try {
        connect();
      } catch (e) {
        console.log("Connection metamask error", e);
      }
    }
  }, [connected, disconnect, connect]);

  useEffect(() => {
    dispatch(setWalletConnected(connected));
    dispatch(getBalances({ address: address, networkId: chainId || defaultNetworkId }));
  }, [connected, address, dispatch]);

  const handleCopyReferralCode = () => {
    if (!referralCode) return;
    copyToClipboard(referralCode);
    const notification: Partial<GrowlNotification> = {
      message: "Referral link copied to clipboard",
      duration: 1000,
    };
    dispatch(addAlert(notification));
  };

  return (
    <Container maxWidth={"lg"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "5%",
          width: "100%",
          gridGap: "40px",
        }}
        className="referral-wrapper"
      >
        <Paper variant="elevation" elevation={6} className="referral-link-paper">
          <Typography variant="h5" component="h5">
            Refer a Friend to Liqd
          </Typography>
          <Box mt={2.5}>
            <Typography variant="subtitle2" component="span">
              Refer someone to Liqd and you’ll earn 5% of all fees they generate on the
              platform. Learn more about this here.
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"row"}
            mt="50px"
            mr="auto"
            alignItems="center"
          >
            <Typography variant="subtitle2" component="span">
              Your Liqd referral link
            </Typography>
            <Box ml={1} display={"flex"}>
              <InfoIcon />
            </Box>
          </Box>

          {connected ? (
            <Box
              display="flex"
              alignItems={"center"}
              mt="21px"
              width="100%"
              gap={3}
              sx={{
                flexDirection: isDesktop ? "row" : "column",
                justifyContent: isDesktop ? "space-between" : "center",
              }}
            >
              <TextField
                id="standard-basic"
                label=""
                variant="standard"
                value={referralCode}
                disabled
                fullWidth
                style={{ color: "#7e9aa9", border: "none" }}
                className="referral-link"
              />
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCopyReferralCode}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          ) : (
            <Box mx={"auto"} mt="50px">
              <Button variant="contained" color="primary" onClick={handleConnect}>
                Connect Wallet
              </Button>
            </Box>
          )}
        </Paper>
        {connected && (
          <>
            <Box className="referral-link-paper">
              <EarningView />
            </Box>
            <Paper className="referral-link-paper" variant="elevation" elevation={6}>
              <ReferralList />
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};
export default Referral;
