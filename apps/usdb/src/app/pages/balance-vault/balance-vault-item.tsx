import { PaperTableCell, PaperTableRow } from "@fantohm/shared-ui-themes";
import { Box, Typography } from "@mui/material";
import { BigNumber } from "ethers";
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
  const fundingAmount = BigNumber.from(Type.fundingAmount).toString();
  return (
    <PaperTableRow className={style["row"]}>
      <PaperTableCell
        sx={{
          display: "flex",
          fontSize: "1rem",
          alignItems: "middle",
          marginRight: "20px",
        }}
      >
        <PaperTableCell key="vaultName" className={style["offerElem"]}>
          <Box className="flex fr ai-c">0000000000000000</Box>
        </PaperTableCell>
      </PaperTableCell>
    </PaperTableRow>
  );
};
