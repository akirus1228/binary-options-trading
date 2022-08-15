import { CustomInnerSwitch, setTheme } from "@fantohm/shared-ui-themes";
import {
  formatCurrency,
  isDev,
  loadErc20Balance,
  NetworkIds,
  networks,
  selectErc20Balance,
  useWeb3Context,
} from "@fantohm/shared-web3";
import {
  Avatar,
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  Paper,
  Popover,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import LaunchIcon from "@mui/icons-material/Launch";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NorthEastOutlinedIcon from "@mui/icons-material/NorthEastOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { addressEllipsis } from "@fantohm/shared-helpers";
import { AppDispatch, RootState } from "../../../store";
import { logout } from "../../../store/reducers/backend-slice";
import AvatarPlaceholder from "../../../../assets/images/temp-avatar.png";
import { desiredNetworkId } from "../../../constants/network";
import { ethers } from "ethers";
import { selectCurrencies } from "../../../store/selectors/currency-selectors";
import ManageFund from "../../managefund/managefund";
import styles from "./header.module.scss";

type PageParams = {
  sx?: SxProps<Theme> | undefined;
  comingSoon?: boolean;
};

type AccountSubMenu = {
  title: string;
  params?: PageParams;
  href?: string;
  icon?: string;
};

export const UserMenu = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  // menu controls
  const [flagAccountDropDown, setFlagAccountDropDown] = useState<null | HTMLElement>(
    null
  );

  const accountSubMenu: AccountSubMenu[] = [
    { title: "My profile", href: "/my-account", icon: "user" },
    { title: "My assets", href: "/my-account#3", icon: "photo" },
    { title: "My loans", href: "/my-account#1", icon: "loan" },
    { title: "Dark theme", href: "#", icon: "sun" },
  ];

  // web3 wallet
  const { connect, disconnect, connected, address } = useWeb3Context();

  const currencies = useSelector((state: RootState) => selectCurrencies(state));
  const erc20Balances = useSelector((state: RootState) => selectErc20Balance(state));
  const { authSignature } = useSelector((state: RootState) => state.backend);

  useEffect(() => {
    if (!address) return;
    dispatch(
      loadErc20Balance({
        networkId: desiredNetworkId,
        address,
        currencyAddress: networks[desiredNetworkId].addresses["USDB_ADDRESS"],
      })
    );
  }, [address]);

  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    connect(true, isDev ? NetworkIds.Rinkeby : NetworkIds.Ethereum);
  };

  const onClickDisconnect = () => {
    disconnect();
    dispatch(logout());
  };

  // theme control
  const themeType = useSelector((state: RootState) => state.theme.mode);

  const accountDrop = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagAccountDropDown(event.currentTarget);
  };

  const toggleTheme = () => {
    dispatch(setTheme(themeType === "light" ? "dark" : "light"));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address).then(
      function () {
        //console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  // make offer code
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleManageFund = () => {
    setDialogOpen(true);
  };

  const onListDialogClose = (accepted: boolean) => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (currencies) {
      Object.values(currencies).forEach((currency) => {
        return dispatch(
          loadErc20Balance({
            networkId: desiredNetworkId,
            address: address,
            currencyAddress: currency.currentAddress,
          })
        );
      });
    }
  }, [currencies]);

  const isWalletConnected = address && authSignature;
  return isWalletConnected ? (
    <>
      <Button
        id="user-menu-button"
        aria-controls={flagAccountDropDown ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={flagAccountDropDown ? "true" : undefined}
        onClick={accountDrop}
        sx={{ background: "#FFF", py: "0.5em", fontSize: "16px" }}
        className={styles["accountButton"]}
      >
        <Box sx={{ display: "block" }} className={styles["accountAvatar"]}>
          <Avatar sx={{ mr: { sm: "0", md: "1em" } }} src={AvatarPlaceholder}></Avatar>
        </Box>
        {addressEllipsis(address)}
        <Box
          sx={{ display: "flex", alignItems: "center", ml: { xs: "0.2em", sm: "1em" } }}
        >
          <Icon component={ArrowDropDownIcon}></Icon>
        </Box>
      </Button>
      <Popover
        id={"Account"}
        open={Boolean(flagAccountDropDown)}
        anchorEl={flagAccountDropDown}
        onClose={() => setFlagAccountDropDown(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="accountDropdown"
      >
        <h3 style={{ marginBottom: "5px", marginTop: "5px" }}>
          {addressEllipsis(address)}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "3px",
          }}
        >
          <h6
            style={{
              color: "grey",
              marginRight: "10px",
              marginTop: "5px",
              marginBottom: "5px",
            }}
          >
            {addressEllipsis(address)}
          </h6>
          <IconButton
            size="small"
            aria-label="copy address"
            sx={{
              width: 40,
              height: 40,
            }}
            className={styles["addressSvg"]}
            onClick={copyToClipboard}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="copy address"
            sx={{
              width: 40,
              height: 40,
            }}
            className={styles["addressSvg"]}
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </div>
        <div
          style={{
            padding: "5px 0",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Container style={{ width: "100%", flex: "0 0 100%", padding: "0" }}>
              <Paper
                style={{
                  marginTop: "5px",
                  marginBottom: "5px",
                  padding: "1em",
                }}
              >
                <Box
                  sx={{
                    marginBottom: "20px",
                  }}
                >
                  <h6
                    style={{
                      color: "grey",
                      marginLeft: "10px",
                      marginTop: "10px",
                      marginBottom: "5px",
                    }}
                  >
                    Wallet balance
                  </h6>
                  {Object.values(currencies).map((currencyInfo) => {
                    const balance =
                      erc20Balances[currencyInfo.currentAddress] ||
                      ethers.BigNumber.from(0);
                    const value = +ethers.utils.formatUnits(
                      balance,
                      currencyInfo.decimals || 18
                    );

                    if (value === 0) {
                      return null;
                    }

                    return (
                      <h4
                        key={currencyInfo.symbol}
                        style={{
                          marginLeft: "10px",
                          marginTop: "5px",
                          marginBottom: "1px",
                        }}
                      >
                        {formatCurrency(value)} {currencyInfo.symbol}
                      </h4>
                    );
                  })}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <div>
                    <h6
                      style={{
                        color: "grey",
                        marginLeft: "10px",
                        marginTop: "5px",
                        marginBottom: "5px",
                      }}
                    >
                      Offer balance
                    </h6>
                    <h4
                      style={{
                        marginLeft: "10px",
                        marginTop: "5px",
                        marginBottom: "1px",
                      }}
                    >
                      {repaymentTotal.toFixed(2)}{" "}
                      {(listings && currency?.symbol) || "USDB"}
                    </h4>
                  </div> */}
                  <ManageFund onClose={onListDialogClose} open={dialogOpen} />
                  <Button
                    size="small"
                    onClick={handleManageFund}
                    sx={{
                      padding: "5px 20px",
                      fontSize: "10px",
                      height: "30px",
                      color: "blue",
                      backgroundColor: "#e6edfd",
                    }}
                  >
                    Manage Allowance
                  </Button>
                </Box>
              </Paper>
            </Container>
          </div>
        </div>
        <Button
          variant="contained"
          sx={{ mt: "10px", mb: "20px", width: "300px", fontSize: "14px" }}
        >
          Buy USDB on Exchanges &nbsp;&nbsp;
          <NorthEastOutlinedIcon />
        </Button>

        {accountSubMenu.map((dropMenu: AccountSubMenu, index: number) => {
          return (
            <Typography
              key={`btn-${dropMenu.title}-${index}`}
              textAlign="left"
              style={{ opacity: dropMenu?.params?.comingSoon ? 0.2 : 1 }}
            >
              {dropMenu.icon === "sun" ? (
                <Button
                  style={{
                    minWidth: "110px",
                    padding: "0.5em 1em",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LightModeOutlinedIcon />
                    &nbsp;&nbsp;
                    {dropMenu.title}
                  </div>
                  {/* <Switch
                                  onChange={themeChange}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                /> */}
                  {/* <Switch checked={checked} onChange={themeChangeColor} /> */}
                  <CustomInnerSwitch
                    checked={themeType === "dark" ? true : false}
                    onClick={toggleTheme}
                  />
                </Button>
              ) : (
                <Link to={dropMenu.href || "#"}>
                  <Button
                    sx={{
                      minWidth: "110px",
                      padding: "0.5em 1em",
                      width: "100%",
                      justifyContent: "left",
                    }}
                    onClick={() => setFlagAccountDropDown(null)}
                  >
                    {dropMenu.icon === "user" ? (
                      <PersonOutlineOutlinedIcon />
                    ) : dropMenu.icon === "photo" ? (
                      <InsertPhotoOutlinedIcon />
                    ) : dropMenu.icon === "loan" ? (
                      <CreditCardOutlinedIcon />
                    ) : null}
                    &nbsp;&nbsp;
                    {dropMenu.title}
                  </Button>
                </Link>
              )}
            </Typography>
          );
        })}

        <Typography
          textAlign="left"
          sx={{
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid #CCCCCC",
          }}
        >
          <Button
            sx={{
              minWidth: "110px",
              padding: "0.5em 1em",
              width: "100%",
              justifyContent: "left",
            }}
            onClick={onClickDisconnect}
          >
            <LogoutOutlinedIcon />
            &nbsp;&nbsp; Disconnect
          </Button>
        </Typography>
      </Popover>
    </>
  ) : (
    <Box>
      <Button
        onClick={onClickConnect}
        sx={{
          backgroundColor: "#FFF",
          color: "#000",
          padding: "0.9em",
          minWidth: { xs: "60px", sm: "250px" },
          fontSize: "16px",
        }}
      >
        Connect
      </Button>
    </Box>
  );
};

export default UserMenu;
