import { Box, Button, Container, TableBody, TableRow, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import { BigNumber } from "ethers";
import CreateVaultForm from "../../components/create-vault/createVault";
import {
  defaultNetworkId,
  getBalanceVaultManager,
  getGeneratedVaultsLength,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { BalanceVaultType } from "../../store/interfaces";
import { PaperTable, PaperTableCell, PaperTableHead } from "@fantohm/shared-ui-themes";
import style from "./balanceVault.module.scss";
import { BalanceVaultItem } from "./balance-vault-item";

export enum BalanceVaultOverview {
  Vault_Name = "Vault",
  Vault_Size = "TVL",
  Vault_Apr = "apr",
  Vault_Duration = "Lock Duration",
  Vault_Currency = "Currencies",
  Vault_Status = "Funding Status",
}

export default function BalanceVault() {
  const { provider, address, chainId, connected } = useWeb3Context();
  const dispatch = useDispatch();

  const [createVaultOpen, setCreateVaultOpen] = useState(false);
  const [balanceVaults, setBalanceVaults] = useState<BalanceVaultType[]>();

  const [vaultLength, setVaultLength] = useState("0");
  const overView = [
    BalanceVaultOverview.Vault_Name,
    BalanceVaultOverview.Vault_Size,
    BalanceVaultOverview.Vault_Apr,
    BalanceVaultOverview.Vault_Duration,
    BalanceVaultOverview.Vault_Currency,
    BalanceVaultOverview.Vault_Status,
  ];
  console.log("length", vaultLength);
  useEffect(() => {
    if (!provider) return;

    dispatch(
      getGeneratedVaultsLength({
        networkId: chainId ?? defaultNetworkId,
        provider: provider,
        callback: (result: any) => {
          setVaultLength(BigNumber.from(result).toString());
        },
      })
    );
  }, [provider, connected, address]);

  useEffect(() => {
    if (!provider) return;

    dispatch(
      getBalanceVaultManager({
        networkId: chainId ?? defaultNetworkId,
        provider: provider,
        skip: "0",
        limit: vaultLength as string,
        callback: (result: any) => {
          const tmpVaults: BalanceVaultType[] = [];
          result.forEach((vault: any) => {
            tmpVaults.push({
              vaultAddress: vault["vaultAddress"],
              index: BigNumber.from(vault["index"]).toString(),
              nftAddress: vault["nftAddress"],
              ownerInfos: vault["ownerInfos"],
              ownerContacts: vault["ownerContacts"],
              ownerWallet: vault["ownerWallet"],
              fundingAmount: vault["fundingAmount"],
              fundraised: vault["fundraised"],
              allowedTokens: vault["allowedTokens"],
              freezeTimestamp: vault["freezeTimestamp"],
              repaymentTimestamp: vault["repaymentTimestamp"],
              apr: vault["apr"],
              shouldBeFrozen: vault["shouldBeFrozen"],
            });
          });
          setBalanceVaults(tmpVaults);
        },
      })
    );
  }, [provider, connected, address, vaultLength]);

  const onCreateVaultOpen = useCallback(() => {
    setCreateVaultOpen(true);
  }, []);
  const onCreateVaultClose = () => {
    setCreateVaultOpen(false);
  };
  console.log("balanceVaults", balanceVaults);
  return (
    <Box>
      <CreateVaultForm onClose={onCreateVaultClose} open={createVaultOpen} />
      <Typography
        sx={{
          fontFamily: "sora",
          fontSize: "35px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Vaults Overview
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontSize: "16px", color: "#8a99a8" }}>
          Hide closed vaults
        </Typography>
        <Switch defaultChecked />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button sx={{ border: "solid 2px #3744e6", width: "13%" }}>
          View portofolio
        </Button>
        <Button
          onClick={onCreateVaultOpen}
          sx={{ border: "solid 2px #252729", width: "13%", ml: "20px" }}
        >
          + Create Vault
        </Button>
      </Box>
      <Container className={style["offerContainer"]}>
        <PaperTable>
          <PaperTableHead>
            <TableRow className={style["rowh"]}>
              {overView.map((item, index) => (
                <PaperTableCell key={index} className={style["offersHead"]}>
                  {item}
                </PaperTableCell>
              ))}
            </TableRow>
          </PaperTableHead>
          <TableBody>
            {balanceVaults &&
              balanceVaults.map((balanceVault: BalanceVaultType, index: number) => (
                <BalanceVaultItem key={index} Type={balanceVault} overview={overView} />
              ))}
          </TableBody>
        </PaperTable>
      </Container>
    </Box>
  );
}
