import {
  Box,
  Button,
  Card,
  Container,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { useWeb3Context } from "@fantohm/shared-web3";
import { EarningView } from "./EarningView";
import { ReferralList } from "./ReferralList";

export const Referral = (): JSX.Element => {
  const {
    address,
    chainId,
    connected,
    disconnect,
    connect,
    provider,
    switchEthereumChain,
  } = useWeb3Context();
  const isDesktop = useMediaQuery('(min-width:767px)');

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

          {address ? (
            <Box
              display="flex"
              alignItems={"center"}
              mt="21px"
              width="100%"
              gap={3}
              sx={{
                flexDirection: isDesktop ? "row" : "column",
                justifyContent: isDesktop? "space-between": "center"
              }}
            >
              <TextField
                id="standard-basic"
                label=""
                variant="standard"
                value={"https://liqdnft.com/?ref=0x43Fe...24d1c"}
                disabled
                fullWidth
                style={{ color: "#7e9aa9", border: "none" }}
                className="referral-link"
              />
              <Box>
                <Button variant="contained" color="primary">
                  Copy
                </Button>
              </Box>
            </Box>
          ) : (
            <Box mx={"auto"} mt="50px">
              <Button variant="contained" color="primary">
                Connect Wallet
              </Button>
            </Box>
          )}
        </Paper>
        {address && (
          <>
            <Box className="referral-link-paper">
              <EarningView />
            </Box>
            <Paper sx={{ width: "80%" }} variant="elevation" elevation={6}>
              <ReferralList />
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};
export default Referral;
