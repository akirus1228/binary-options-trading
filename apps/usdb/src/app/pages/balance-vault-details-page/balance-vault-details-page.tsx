import { copyToClipboard, formatCurrency } from "@fantohm/shared-helpers";
import {
  getErc20CurrencyFromAddress,
  prettifySeconds,
  useWeb3Context,
} from "@fantohm/shared-web3";

import { useState, useCallback } from "react";
import { DaiToken, TakepileLogo } from "@fantohm/shared/images";
import { ContentCopy, NorthEast, OpenInNew } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useBalanceVault, useBalanceVaultPosition } from "../../hooks/use-balance-vault";
import { RootState } from "../../store";
import style from "./balance-vault-details-page.module.scss";
import { ExternalLink } from "./external-link";
import { PositionTemplate } from "./position-template";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VaultActionForm from "../../components/vault-action/vault-action-form";

export const BalanceVaultDetailsPage = (): JSX.Element => {
  const { vaultId } = useParams();
  const themeType = useSelector((state: RootState) => state.app.theme);

  const { chainId } = useWeb3Context();

  const { vaultData } = useBalanceVault(vaultId as string);
  const { positionData } = useBalanceVaultPosition(vaultId as string);

  const handleCopyAddress = () => {
    copyToClipboard(vaultData?.ownerWallet ?? "");
  };
  const [vaultActionFormOpen, setVaultActionFormOpen] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);

  // theme relevant style data
  const borderStyle = themeType === "light" ? "2px solid #ECECF4" : "2px solid #101112";
  const lowContrastBg =
    themeType === "light"
      ? style["low-contrast-bg-light"]
      : style["low-contrast-bg-dark"];
  const lowContrastText =
    themeType === "light"
      ? style["low-contrast-text-light"]
      : style["low-contrast-text-dark"];

  const onDeposit = () => {
    setIsDeposit(true);
    setVaultActionFormOpen(true);
  };

  const onWithdraw = () => {
    setIsDeposit(false);
    setVaultActionFormOpen(true);
  };

  const onVaultActionFormClose = () => {
    setVaultActionFormOpen(false);
  };

  return (
    <Box className="flexCenterRow" id="content-centering-container" sx={{ mt: "100px" }}>
      <VaultActionForm
        vaultId={vaultId as string}
        onClose={onVaultActionFormClose}
        deposit={isDeposit}
        open={vaultActionFormOpen}
      />
      <Box className="grid g-x-2" sx={{ m: "2em" }} maxWidth="xl" id="grid-container">
        <Box
          className="rounded-lg"
          sx={{ border: borderStyle, background: themeType === "light" ? "#FFF" : "" }}
          id="left-box"
        >
          <Box
            className="flex fr fj-sb ai-c gap-x-2"
            sx={{ borderBottom: borderStyle, p: "2em" }}
            id="left-box-header"
          >
            <Box className="flex fr ai-c">
              <Avatar
                src={vaultData?.ownerContacts[0]}
                sx={{ p: "5px", border: borderStyle, mr: "1em" }}
              />
              <h2 className={`${style["text-lg"]}`}>{vaultData?.name}</h2>
            </Box>
            <Box className="flex fr">
              <Button
                variant="contained"
                className="thinSquaredButton"
                sx={{
                  backgroundColor: themeType === "light" ? "#0a0c0f0a" : "#0D1014",
                  color: themeType === "light" ? "#000" : "#8A99A8",
                }}
                onClick={onDeposit}
              >
                + Deposit
              </Button>
              <Button
                variant="contained"
                className="thinSquaredButton"
                sx={{
                  backgroundColor: themeType === "light" ? "#0a0c0f0a" : "#0D1014",
                  color: themeType === "light" ? "#000" : "#8A99A859",
                }}
                onClick={onWithdraw}
              >
                - Withdraw
              </Button>
            </Box>
          </Box>
          <Box sx={{ p: "2em" }} id="left-box-content">
            <Box
              sx={{ p: "1em" }}
              className={`flex fr ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
            >
              <Box>
                <Typography>Vault Funding</Typography>
                <h2 className={`${style["text-lg"]}`}>
                  {vaultData?.fundsRaised &&
                    formatCurrency(
                      +ethers.utils.formatUnits(vaultData?.fundsRaised, 18)
                    )}{" "}
                  /{" "}
                  {vaultData?.fundingAmount &&
                    formatCurrency(
                      +ethers.utils.formatUnits(vaultData?.fundingAmount, 18)
                    )}
                </h2>
              </Box>
              <Box>
                <Button variant="contained" className="thinButton" onClick={onDeposit}>
                  Open
                </Button>
              </Box>
            </Box>
            <Box className="grid g-x-3" sx={{ mt: "1em" }}>
              <Box
                sx={{ p: "1em" }}
                className={`flex fc jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
              >
                <span>Vault APR</span>
                <h2 className={style["text-md"]}>{vaultData && vaultData?.apr / 100}%</h2>
              </Box>
              <Box
                sx={{ p: "1em" }}
                className={`flex fc jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
              >
                <span>Lock duration</span>
                <h2 className={style["text-md"]}>
                  {prettifySeconds(vaultData?.lockDuration ?? 0)}
                </h2>
              </Box>
              <Box
                sx={{ p: "1em" }}
                className={`flex fc jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
              >
                <span>Currencies</span>
                <h2 className={style["text-md"]}>
                  {vaultData &&
                    vaultData?.allowedTokens.map((currency) => (
                      <span key={currency}>
                        {getErc20CurrencyFromAddress(currency, chainId || 4).symbol}
                      </span>
                    ))}
                </h2>
              </Box>
            </Box>
            <Box className="grid g-x-2">
              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <h2 className={style["text-md"]}>Overview</h2>
                  <Icon
                    component={InfoOutlinedIcon}
                    fontSize={"medium"}
                    sx={{ ml: "5px" }}
                  />
                </Box>
                <p className={lowContrastText}>
                  Deposit{" "}
                  {vaultData &&
                    vaultData?.allowedTokens.map((currency) => (
                      <span key={currency}>
                        {getErc20CurrencyFromAddress(currency, chainId || 4).symbol}{" "}
                      </span>
                    ))}{" "}
                  to earn from this vault. Funds are locked for{" "}
                  {prettifySeconds(vaultData?.lockDuration ?? 0)} once the vault’s desired
                  financing has been met.
                </p>
                <Box className="flex ai-c">
                  <h2 className={style["text-md"]}>Lock Duration</h2>
                  <Icon
                    component={InfoOutlinedIcon}
                    fontSize={"medium"}
                    sx={{ ml: "5px" }}
                  />
                </Box>
                <Box className="flex fr jf-sb ai-c" sx={{ textAlign: "center" }}>
                  <span>{vaultData?.time.completedTime}</span>
                  <LinearProgress
                    value={vaultData?.time.percentComplete ?? 0}
                    variant="determinate"
                    sx={{ width: "50%", ml: "10px", mr: "10px" }}
                  />
                  <span>{prettifySeconds(vaultData?.lockDuration ?? 0)}</span>
                </Box>
              </Box>
              <Box className="flex fc fj-sb">
                <Box className="flex fr fj-sb ai-c">
                  <Box className="flex ai-c">
                    <h2 className={style["text-md"]}>My Position</h2>
                    <Icon
                      component={InfoOutlinedIcon}
                      fontSize={"medium"}
                      sx={{ ml: "5px" }}
                    />
                  </Box>
                  <Typography sx={{ color: "#69D9C8" }}>
                    {formatCurrency(positionData?.totalUsdValue ?? 0)}
                  </Typography>
                  {/* todo: replace with position total */}
                </Box>
                <Box className="flex fr fj-sb ai-c">
                  <span>Asset</span>
                  <span>My position</span>
                </Box>
                {positionData &&
                  positionData.positionEntries.map((position) => (
                    <PositionTemplate
                      key={position.tokenId}
                      currency={getErc20CurrencyFromAddress(
                        position.tokenId,
                        chainId || 4
                      )}
                      amount={position.amount}
                    />
                  ))}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          className="rounded-lg"
          sx={{ border: borderStyle, background: themeType === "light" ? "#FFF" : "" }}
          id="right-box"
        >
          <Box
            className="flex fr fj-sb gap-x-2"
            sx={{ borderBottom: borderStyle, p: "2em" }}
            id="right-box-header"
          >
            <h2 className={`${style["text-lg"]}`}>About</h2>
            <Button
              variant="contained"
              disabled={true}
              className="thinSquaredButton"
              sx={{
                backgroundColor: "#0D1014",
                color: "#8A99A8",
              }}
            >
              + Edit
            </Button>
          </Box>
          <Box sx={{ p: "2em" }}>
            <Box className="flex ai-c">
              <h2 className={`${style["text-md"]}`}>Description</h2>
              <Icon component={InfoOutlinedIcon} fontSize={"medium"} sx={{ ml: "5px" }} />
            </Box>
            <p className={lowContrastText}>{vaultData?.description}</p>
            <Box className="flex ai-c">
              <h2 className={`${style["text-md"]}`}>Vault owner</h2>
              <Icon component={InfoOutlinedIcon} fontSize={"medium"} sx={{ ml: "5px" }} />
            </Box>
            <Box
              sx={{ p: "0.75em" }}
              className={`flex fr jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
            >
              <span className={lowContrastText}>
                {vaultData && vaultData?.ownerWallet}
              </span>
              <Box>
                <IconButton onClick={handleCopyAddress}>
                  <ContentCopy sx={{ color: "#8A99A8" }} />
                </IconButton>
                <IconButton
                  href={`https://etherscan.io/address/${vaultData?.ownerWallet}`}
                >
                  <OpenInNew sx={{ color: "#8A99A8" }} />
                </IconButton>
              </Box>
            </Box>
            <Box className="flex ai-c">
              <h2 className={`${style["text-md"]}`}>External Links</h2>
              <Icon component={InfoOutlinedIcon} fontSize={"medium"} sx={{ ml: "5px" }} />
            </Box>
            <Box className="flex fr ai-c gap-x-1">
              {vaultData?.ownerContacts.map(
                (item, index) =>
                  item.search("~!_") > -1 && (
                    <ExternalLink
                      key={index}
                      href={item.split("~!_")[1]}
                      title={item.split("~!_")[0]}
                    />
                  )
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BalanceVaultDetailsPage;
