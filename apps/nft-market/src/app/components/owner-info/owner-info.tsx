import {
  Box,
  Button,
  CircularProgress,
  Icon,
  Paper,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SimpleProfile from "../simple-profile/simple-profile";
import style from "./owner-info.module.scss";
import ArrowRightUp from "../../../assets/icons/arrow-right-up.svg";
import { isDev } from "@fantohm/shared-web3";
import { CircleGraph } from "@fantohm/shared/ui-charts";
import { useGetWalletQuery } from "../../api/backend-api";
import { formatCurrency } from "@fantohm/shared-helpers";
import { useMemo } from "react";
import ColorLabel from "./color-label";

export interface OwnerInfoProps {
  address: string;
  sx?: SxProps<Theme>;
}

const OwnerInfoTooltip = (title: string) => {
  return (
    <Tooltip
      title={title}
      componentsProps={{
        tooltip: {
          style: {
            marginTop: "0.5rem",
            width: "16em",
            background: "black",
            padding: "1rem",
            borderRadius: "1rem",
            fontSize: "1rem",
          },
        },
      }}
    >
      <Icon component={InfoOutlinedIcon} />
    </Tooltip>
  );
};

export const OwnerInfo = ({ address, sx }: OwnerInfoProps): JSX.Element => {
  const { data: ownerInfo, isLoading: isOwnerInfoLoading } = useGetWalletQuery(
    address || "",
    { skip: !address }
  );

  const defaultRate = useMemo(() => {
    if (!ownerInfo) return 0;
    if (ownerInfo?.loansRepaid === 0 && ownerInfo?.loansDefaulted === 0) return 0;
    const totalLoans = ownerInfo.loansDefaulted + ownerInfo.loansRepaid;
    return (ownerInfo.loansDefaulted / totalLoans) * 100;
  }, [ownerInfo?.loansRepaid, ownerInfo?.loansDefaulted]);

  const lendToBorrowRatio = useMemo(() => {
    if (!ownerInfo) return 0;
    if (ownerInfo?.loansBorrowed === 0 && ownerInfo?.loansGiven === 0) return 0;
    const totalLoans = ownerInfo?.loansBorrowed + ownerInfo?.loansGiven;
    return (ownerInfo.loansGiven / totalLoans) * 100;
  }, [ownerInfo?.loansBorrowed, ownerInfo?.loansGiven]);

  if (isOwnerInfoLoading) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box className="flex fc fj-fs" sx={{ mb: "5em", ...sx }}>
      <h2>Owner information</h2>
      <Paper className="flex fr fw ai-c" sx={{ minHeight: "180px" }}>
        <Box className={`flex fc fw ai-c ${style["view_eth_button"]}`} sx={{ mr: "2em" }}>
          <SimpleProfile address={address} />
          <Button
            className="slim lowContrast"
            variant="contained"
            sx={{ fontSize: "10px", mt: "1em" }}
            href={`https://${
              isDev() ? "rinkeby" : "www"
            }.etherscan.io/address/${address}`}
            target="_blank"
          >
            View on Etherscan
            <img
              src={ArrowRightUp}
              style={{ height: "10px", width: "10px", marginLeft: "1em" }}
              alt="arrow pointing up and to the right"
            />
          </Button>
        </Box>
        <Box className="flex fc">
          <Typography>
            Overview
            {OwnerInfoTooltip("The total value borrowed/lent by this user.")}
          </Typography>
          <Box className="flex fr fj-sb" sx={{ mt: "2em" }}>
            <Box className="flex fc" sx={{ mr: "2em" }}>
              <span style={{ color: "#8991A2" }}>Total borrowed</span>
              <span>{formatCurrency(ownerInfo?.totalBorrowed || 0)}</span>
            </Box>
            <Box className="flex fc">
              <span style={{ color: "#8991A2" }}>Total lent</span>
              <span>{formatCurrency(ownerInfo?.totalLent || 0)}</span>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Paper className="flex fr fw ai-c" sx={{ minHeight: "180px", mt: "1em" }}>
        {ownerInfo && (
          <Box className="flex fr fw ai-c" sx={{ mr: "2em" }}>
            <CircleGraph progress={defaultRate} sx={{ mr: "2em" }} />
            <Box className="flex fc">
              <span>
                Default rate
                {OwnerInfoTooltip(
                  "The ratio to which this user has repaid versus defaulted on loans borrowed."
                )}
              </span>
              <Box className="flex fr">
                <Box className="flex fc" sx={{ mr: "2em" }}>
                  <ColorLabel color="#1B9385" label="Loans repaid" />
                  <span>{ownerInfo?.loansRepaid}</span>
                </Box>
                <Box className="flex fc">
                  <ColorLabel color="#5731C3" label="Loans defaulted" />
                  <span>{ownerInfo?.loansDefaulted}</span>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
      <Paper className="flex fr fw ai-c" sx={{ minHeight: "180px", mt: "1em" }}>
        {ownerInfo && (
          <Box className="flex fr fw ai-c" sx={{ mr: "2em" }}>
            <CircleGraph progress={lendToBorrowRatio} sx={{ mr: "2em" }} />
            <Box className="flex fc">
              <span>
                Loan Activity
                {OwnerInfoTooltip(
                  "The number of times this user has borrowed versus lent money."
                )}
              </span>
              <Box className="flex fr">
                <Box className="flex fc" sx={{ mr: "2em" }}>
                  <ColorLabel color="#1B9385" label="Loans borrowed" />
                  <span>{ownerInfo?.loansBorrowed}</span>
                </Box>
                <Box className="flex fc">
                  <ColorLabel color="#5731C3" label="Loans given" />
                  <span>{ownerInfo?.loansGiven}</span>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default OwnerInfo;
