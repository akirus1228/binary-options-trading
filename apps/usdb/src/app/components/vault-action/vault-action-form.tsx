import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Dialog,
  Icon,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { BigNumber, ethers } from "ethers";
import styles from "./vault-action-form.module.scss";
import { USDBToken } from "@fantohm/shared/images";
import { formatCurrency } from "@fantohm/shared-helpers";
import {
  currencyInfo,
  useWeb3Context,
  vaultDeposit,
  Erc20Currency,
  erc20Currency,
  useErc20Balance,
  useGetErc20Allowance,
  useRequestErc20Allowance,
  vaultWithdraw,
  prettifySeconds,
  vaultRedeem,
  getRoiAmount,
  getTokenPrice,
  getRedeemAmount,
} from "@fantohm/shared-web3";
import { useBalanceVault, useBalanceVaultPosition } from "../../hooks/use-balance-vault";
import FormInputWrapper from "../formInputWrapper";
import { AppDispatch, RootState } from "../../store";
import { useQueryClient } from "@tanstack/react-query";

export interface VaultActionProps {
  vaultId: string;
  onClose: (value: boolean) => void;
  deposit: boolean;
  open: boolean;
  redeemPrepared: boolean;
}

export const VaultActionForm = (props: VaultActionProps): JSX.Element => {
  const { vaultId, onClose, open, deposit, redeemPrepared } = props;
  const queryClient = useQueryClient();
  const { vaultData } = useBalanceVault(vaultId as string);

  const { provider, address, chainId } = useWeb3Context();
  const dispatch: AppDispatch = useDispatch();

  const [isDeposit, setIsDeposit] = useState(deposit);
  const [amount, setAmount] = useState("0");
  const [token, setToken] = useState("USDB");
  const [currency, setCurrency] = useState<Erc20Currency>();
  const [isPending, setIsPending] = useState(false);
  const [yieldAmount, setYieldAmount] = useState("0");
  const [dollarAmount, setDollarAmount] = useState("0");
  const [redeemAmount, setRedeemAmount] = useState("0");
  const themeType = useSelector((state: RootState) => state.app.theme);

  const { positionData, isLoading: isPositionLoading } = useBalanceVaultPosition(
    vaultId as string
  );

  const { balance: currencyBalance, isLoading: isBalanceLoading } = useErc20Balance(
    currency?.currentAddress ?? "",
    address
  );

  const { allowance: erc20Allowance, isLoading: isAllowanceLoading } =
    useGetErc20Allowance(currency?.currentAddress ?? "", address, vaultId);

  const { mutation: requestAllowance } = useRequestErc20Allowance(
    currency?.currentAddress ?? "",
    vaultId,
    ethers.utils.parseUnits(amount || "0", currency?.decimals ?? 18)
  );

  const handleRequestAllowance = () => {
    requestAllowance.mutate();
  };

  useEffect(() => {
    if (open) {
      setIsDeposit(deposit);
    }
  }, [open]);

  const handleClose = () => {
    onClose(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const doNothing = () => {};

  const handleDeposit = async () => {
    if (provider) {
      setIsPending(true);
      dispatch(
        vaultDeposit({
          address,
          vaultId,
          amount: ethers.utils.parseUnits(amount, 18),
          token: currency?.currentAddress ?? "",
          provider,
          networkId: chainId ?? 250,
        })
      )
        .unwrap()
        .then(() => {
          queryClient.invalidateQueries(["vault"]);
          queryClient.invalidateQueries(["vaultPosition"]);
          onClose(true);
          setAmount("0");
          setIsPending(false);
        });
    }
  };

  const handleWithdraw = async () => {
    if (provider) {
      setIsPending(true);
      dispatch(
        vaultWithdraw({
          address,
          vaultId,
          provider,
          networkId: chainId ?? 250,
        })
      )
        .unwrap()
        .then(() => {
          queryClient.invalidateQueries(["vault"]);
          queryClient.invalidateQueries(["vaultPosition"]);
          onClose(true);
          setAmount("0");
          setIsPending(false);
        });
    }
  };

  const handleRedeem = async () => {
    if (provider) {
      setIsPending(true);
      dispatch(
        vaultRedeem({
          address,
          vaultId,
          provider,
          networkId: chainId ?? 250,
        })
      )
        .unwrap()
        .then(() => {
          queryClient.invalidateQueries(["vault"]);
          queryClient.invalidateQueries(["vaultPosition"]);
          onClose(true);
          setAmount("0");
          setIsPending(false);
        });
    }
  };

  useEffect(() => {
    if (
      isPositionLoading ||
      isBalanceLoading ||
      isAllowanceLoading ||
      requestAllowance.isLoading
    ) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }
  }, [
    isPositionLoading,
    isBalanceLoading,
    isAllowanceLoading,
    requestAllowance.isLoading,
  ]);

  useEffect(() => {
    const currencyObj = Object.entries(currencyInfo).find(
      ([tokenId, currencyDetails]) => currencyDetails.symbol === token
    );
    if (!currencyObj) return;
    setCurrency(new erc20Currency(currencyObj[0], chainId ?? 4));
  }, [token]);

  useEffect(() => {
    const fetchRoi = async () => {
      if (provider === null || amount.trim() === "" || parseFloat(amount) === 0) {
        setYieldAmount("0");
        setDollarAmount("0");
      } else {
        const roi: BigNumber = await dispatch(
          getRoiAmount({
            vaultId,
            amount: ethers.utils.parseUnits(amount, 18),
            provider,
          })
        ).unwrap();
        setYieldAmount(ethers.utils.formatUnits(roi, currency?.decimals ?? 18));
        // const dollar = await getTokenPrice(token.toLowerCase());
        setDollarAmount(ethers.utils.formatUnits(roi, currency?.decimals ?? 18));
      }
    };

    fetchRoi();
  }, [amount]);

  useEffect(() => {
    const fetchRedeem = async () => {
      if (provider === null) {
        setRedeemAmount("0");
      } else {
        const redeem = await dispatch(
          getRedeemAmount({
            vaultId,
            address,
            provider,
          })
        ).unwrap();
        setRedeemAmount(ethers.utils.formatUnits(redeem, currency?.decimals ?? 18));
      }
    };

    fetchRedeem();
  }, [address]);

  const hasAllowance = useMemo(() => {
    console.log(
      "erc20Allowance",
      ethers.utils.formatUnits(erc20Allowance || 0, currency?.decimals ?? 18)
    );
    if (!erc20Allowance) return false;
    return ethers.utils.parseUnits(amount || "0", 18).lte(erc20Allowance);
  }, [amount, erc20Allowance]);

  const hasBalance = useMemo(() => {
    if (!currencyBalance) return false;
    return ethers.utils.parseUnits(amount || "0", 18).lte(currencyBalance);
  }, [amount, currencyBalance]);

  const shouldOverlay = useMemo(() => {
    const curTime = Math.round(new Date().getTime() / 1000);
    if (!vaultData?.shouldBeFrozen) return false;
    if (!isDeposit && !vaultData?.frozen && curTime > vaultData?.repaymentTimestamp)
      return false;
    return true;
  }, [isPending, isDeposit, vaultData]);

  const shouldDisabled = useMemo(() => {
    if (redeemPrepared) return parseFloat(redeemAmount) === 0;
    return (
      isPending ||
      shouldOverlay ||
      (isDeposit ? !hasBalance || amount === "0" : positionData?.totalUsdValue === 0)
    );
  }, [isPending, shouldOverlay, isDeposit, hasBalance, amount, positionData]);

  return !redeemPrepared ? (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          background: themeType === "light" ? "white" : "black",
          border: "1px solid #101112",
          maxWidth: "800px",
        },
      }}
      sx={{ padding: "3em" }}
      fullWidth
    >
      <Box className="flex fr fj-c" sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          className={styles["tapButton"]}
          onClick={() => setIsDeposit(true)}
          sx={{
            borderBottom: `${
              isDeposit
                ? `solid 3px ${themeType === "light" ? "black" : "white"}`
                : "none"
            }`,
          }}
        >
          Deposit
        </Box>
        <Box
          className={styles["tapButton"]}
          onClick={() => setIsDeposit(false)}
          sx={{
            borderBottom: `${
              isDeposit
                ? "none"
                : `solid 3px ${themeType === "light" ? "black" : "white"}`
            }`,
          }}
        >
          Withdraw
        </Box>
      </Box>
      <Box
        className="flex fc"
        sx={{ borderTop: "1px solid #aaaaaa", paddingTop: "40px" }}
      >
        {isDeposit ? (
          <>
            <FormInputWrapper title="My wallet">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box
                  className="flex fr ai-c"
                  sx={{
                    padding: "10px 20px",
                    border: "1px solid #101112",
                    borderRadius: "10px",
                  }}
                >
                  <Select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    variant="standard"
                    sx={{ background: "transparent" }}
                    className="borderless"
                    disableUnderline
                    disabled
                  >
                    {Object.entries(currencyInfo).map(([tokenId, currencyDetails]) => (
                      <MenuItem
                        value={currencyDetails.symbol}
                        key={`currency-option-item-${tokenId}`}
                      >
                        <Box className="flex fr ai-c">
                          <img
                            style={{ height: "26px", width: "26px", marginRight: 10 }}
                            src={currencyDetails.icon}
                            alt={`${currencyDetails.symbol} Token Icon`}
                          />
                          <Typography sx={{ fontSize: 16 }}>
                            {currencyDetails.symbol}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <TextField
                  variant="standard"
                  type="number"
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      flexGrow: 1,
                      fontSize: "30px",
                    },
                  }}
                  inputProps={{ style: { textAlign: "right" } }}
                  sx={{
                    width: "100%",
                    marginLeft: "20px",
                  }}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginTop: "30px", fontSize: "18px", color: "#8A99A8" }}
              >
                <Typography>
                  Wallet balance:{" "}
                  {currencyBalance &&
                    ethers.utils.formatUnits(currencyBalance, currency?.decimals ?? 18)}
                </Typography>
                <Typography>${amount || 0}</Typography>
              </Box>
            </FormInputWrapper>
            <FormInputWrapper title="Estimated yield" className={styles["inputWrapper"]}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box
                  className="flex fr ai-c"
                  sx={{
                    padding: "10px 20px",
                    border: "1px solid #101112",
                    borderRadius: "10px",
                  }}
                >
                  <img
                    style={{ height: "26px", width: "26px", marginRight: 10 }}
                    src={USDBToken}
                    alt="USDB Token Icon"
                  />
                  <Typography sx={{ fontSize: 16 }}>USDB</Typography>
                </Box>
                <Typography sx={{ fontSize: 30, color: "#8A99A8" }}>
                  {yieldAmount}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginTop: "30px", fontSize: "18px", color: "#8A99A8" }}
              >
                <Box display="flex">
                  <Typography>Yield:&nbsp;</Typography>
                  <Typography sx={{ color: "#69D9C8" }}>
                    {(vaultData?.apr ?? 0) / 100}%
                  </Typography>
                </Box>
                <Typography>${dollarAmount}</Typography>
              </Box>
            </FormInputWrapper>
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            sx={{ fontSize: "18px", color: "#8A99A8" }}
          >
            <Typography>
              My Position: {formatCurrency(positionData?.totalUsdValue ?? 0)}
            </Typography>
          </Box>
        )}
        <Button
          sx={{ marginTop: "30px" }}
          className={styles[shouldDisabled ? "disabled" : "button"]}
          onClick={
            isPending
              ? doNothing
              : !isDeposit
              ? handleWithdraw
              : !hasBalance
              ? doNothing
              : !hasAllowance
              ? handleRequestAllowance
              : handleDeposit
          }
          disabled={shouldDisabled}
        >
          {isPending ? (
            <CircularProgress size="1.5em" />
          ) : !isDeposit ? (
            "Withdraw"
          ) : !hasBalance ? (
            "Insufficient Balance"
          ) : !hasAllowance ? (
            "Request Allowance"
          ) : (
            "Deposit"
          )}
        </Button>
      </Box>
      {shouldOverlay && (
        <Box
          className="flex fr"
          style={{
            flex: 1,
            backgroundColor: "#47494b88",
            backdropFilter: "blur(6px)",
            position: "absolute",
            top: "150px",
            bottom: "20px",
            left: "20px",
            right: "20px",
            zIndex: 99,
            borderRadius: "53px",
          }}
        >
          <Box
            className="flex"
            style={{
              flex: 1,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              className="flex fr"
              style={{
                flex: 1,
                marginLeft: "100px",
                marginRight: "100px",
                padding: "5px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: themeType === "light" ? "#d9d9d9" : "#161616",
                borderRadius: "30px",
              }}
            >
              <Icon
                component={InfoOutlinedIcon}
                color="inherit"
                fontSize={"large"}
                sx={{ ml: "5px" }}
              />
              <span style={{ width: "10px" }} />
              <h2 className={styles["text-md"]}>
                {vaultData?.frozen
                  ? "Vault is frozen"
                  : vaultData?.shouldBeFrozen
                  ? "Vault should be frozen"
                  : `Funding is locked for ${prettifySeconds(
                      (vaultData?.repaymentTimestamp ?? 0) -
                        Math.round(new Date().getTime() / 1000)
                    )} more`}
              </h2>
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  ) : (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          background: themeType === "light" ? "white" : "black",
          border: "1px solid #101112",
          maxWidth: "800px",
        },
      }}
      sx={{ padding: "3em" }}
      fullWidth
    >
      <Box className="flex fr fj-c" sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          className={styles["tapButton"]}
          sx={{
            borderBottom: `${
              isDeposit
                ? `solid 3px ${themeType === "light" ? "black" : "white"}`
                : "none"
            }`,
            cursor: "default",
          }}
        >
          Redeem
        </Box>
      </Box>
      <Box
        className="flex fc"
        sx={{ borderTop: "1px solid #aaaaaa", paddingTop: "40px" }}
      >
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          sx={{ fontSize: "18px", color: "#8A99A8" }}
        >
          <Typography>My Position: {redeemAmount}</Typography>
        </Box>
        <Button
          sx={{ marginTop: "30px" }}
          className={styles[shouldDisabled ? "disabled" : "button"]}
          onClick={handleRedeem}
          disabled={shouldDisabled}
        >
          {isPending ? <CircularProgress size="1.5em" /> : "Redeem"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default VaultActionForm;
