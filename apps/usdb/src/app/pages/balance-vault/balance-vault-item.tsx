import { PaperTableCell, PaperTableRow } from "@fantohm/shared-ui-themes";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { BalanceVaultType } from "../../store/interfaces";
import { BalanceVaultOverview } from "./balanceVault";
import style from "./balanceVault.module.scss";
import { Link } from "react-router-dom";
import {
  useWeb3Context,
  defaultNetworkId,
  getErc20CurrencyFromAddress,
} from "@fantohm/shared-web3";
import { TakepileLogo } from "@fantohm/shared/images";

export type BalanceVaultItemProps = {
  Type: BalanceVaultType;
  overview?: BalanceVaultOverview[];
};

export const BalanceVaultItem = ({
  Type,
  overview,
}: BalanceVaultItemProps): JSX.Element => {
  const { provider, address, chainId, connected } = useWeb3Context();
  const fundingAmount = BigNumber.from(Type.fundingAmount)
    .div(Math.pow(10, 15))
    .div(1000)
    .toString();
  const fundraisedAmount = BigNumber.from(Type.fundraised)
    .div(Math.pow(10, 15))
    .div(1000)
    .toString();
  const apr = parseFloat(BigNumber.from(Type.apr).div(100).toString()).toFixed(2);
  const duration = BigNumber.from(Type.repaymentTimestamp)
    .sub(BigNumber.from(Type.freezeTimestamp))
    .div(86400)
    .toString();
  return (
    <PaperTableRow className={style["row"]}>
      <PaperTableCell key="vaultName" className={style["offerElem"]}>
        <Box sx={{ display: "flex" }}>
          <img
            src={TakepileLogo}
            alt="TakePileLogo"
            style={{ width: "43px", marginRight: "10px" }}
          ></img>
          <Box className="flex fr ai-c">{Type.ownerInfos[0]}</Box>
        </Box>
      </PaperTableCell>
      <PaperTableCell key="vaultAmount" className={style["offerElem"]}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box className="flex fr ai-c">${fundraisedAmount}K</Box>
          <LinearProgress
            variant="determinate"
            value={Number(
              BigNumber.from(Type.fundingAmount).div(BigNumber.from(Type.fundraised))
            )}
            sx={{ width: "60%", ml: "5%", mr: "5%" }}
          />
          <Box className="flex fr ai-c">${fundingAmount}K</Box>
        </Box>
      </PaperTableCell>
      <PaperTableCell key="vaultapr" className={style["offerElem"]}>
        <Box className="flex fr ai-c">{apr}%</Box>
      </PaperTableCell>
      <PaperTableCell key="vaultduration" className={style["offerElem"]}>
        <Box className="flex fr ai-c">{duration} days</Box>
      </PaperTableCell>
      <PaperTableCell>
        {Type.allowedTokens.map((item, index) => (
          <img
            key={index}
            src={getErc20CurrencyFromAddress(item, chainId ?? defaultNetworkId).icon}
            alt={getErc20CurrencyFromAddress(item, chainId ?? defaultNetworkId).symbol}
            style={{ width: "23px" }}
          ></img>
        ))}
      </PaperTableCell>
      <PaperTableCell>
        <Link to={`/vault/${Type.vaultAddress}`} key={Type.ownerInfos[0]}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#262f38",
              fontSize: "18px",
              height: "30px",
              color: "white",
            }}
          >
            open
          </Button>
        </Link>
      </PaperTableCell>
    </PaperTableRow>
  );
};
