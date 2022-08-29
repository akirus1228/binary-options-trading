import { PaperTableCell, PaperTableRow } from "@fantohm/shared-ui-themes";
import { Box, Button, Typography } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { BalanceVaultType } from "../../store/interfaces";
import { BalanceVaultOverview } from "./balanceVault";
import style from "./balanceVault.module.scss";

export type BalanceVaultItemProps = {
  Type: BalanceVaultType;
  overview?: BalanceVaultOverview[];
};

export const BalanceVaultItem = ({
  Type,
  overview,
}: BalanceVaultItemProps): JSX.Element => {
  const fundingAmount = BigNumber.from(Type.fundingAmount)
    .div(Math.pow(10, 15))
    .div(1000)
    .toString();
  const apr = BigNumber.from(Type.apr).div(100).toString();
  const duration = BigNumber.from(Type.repaymentTimestamp)
    .sub(BigNumber.from(Type.freezeTimestamp))
    .div(86400)
    .toString();
  return (
    <PaperTableRow className={style["row"]}>
      <PaperTableCell key="vaultName" className={style["offerElem"]}>
        <Box className="flex fr ai-c">{Type.ownerInfos}</Box>
      </PaperTableCell>
      <PaperTableCell key="vaultAmount" className={style["offerElem"]}>
        <Box className="flex fr ai-c">{fundingAmount}</Box>
      </PaperTableCell>
      <PaperTableCell key="vaultapr" className={style["offerElem"]}>
        <Box className="flex fr ai-c">{apr}</Box>
      </PaperTableCell>
      <PaperTableCell key="vaultduration" className={style["offerElem"]}>
        <Box className="flex fr ai-c">{duration}</Box>
      </PaperTableCell>
      <PaperTableCell>Token</PaperTableCell>
      <PaperTableCell>
        <Button variant="contained">open</Button>
      </PaperTableCell>
    </PaperTableRow>
  );
};
