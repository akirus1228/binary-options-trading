import React, { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  SxProps,
  Theme,
  Toolbar,
  Typography,
  Popover,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LaunchIcon from "@mui/icons-material/Launch";
import NorthEastOutlinedIcon from "@mui/icons-material/NorthEastOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import {
  enabledNetworkIds,
  useWeb3Context,
  isDev,
  NetworkIds,
} from "@fantohm/shared-web3";
import { addressEllipsis, truncateDecimals } from "@fantohm/shared-helpers";

import { CustomInnerSwitch, setTheme } from "@fantohm/shared-ui-themes";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../store";
import { logout } from "../../../store/reducers/backend-slice";

import MenuLink from "./menu-link";
import styles from "./header.module.scss";
import UserMenu from "./user-menu";
import NotificationMenu from "./notification-menu";
import logo from "../../../../assets/images/logo.svg";
import coin from "../../../../favicon-32x32.png";

type PageParams = {
  sx?: SxProps<Theme> | undefined;
  comingSoon?: boolean;
};

type Page = {
  title: string;
  params?: PageParams;
  href?: string;
};
type AccountSubMenu = {
  title: string;
  params?: PageParams;
  href?: string;
  icon?: string;
};

const pages: Page[] = [
  { title: "Lend", href: "/lend" },
  { title: "Borrow", href: "/borrow" },
  { title: "Learn", href: "/learn" },
  { title: "Account", href: "#" },
  { title: "About", href: "/about" },
];

const accountSubMenu: AccountSubMenu[] = [
  { title: "My profile", href: "/my-account", icon: "user" },
  { title: "My assets", href: "/my-account#assets", icon: "photo" },
  { title: "My loans", href: "/my-account#loans", icon: "loan" },
  { title: "Dark theme", href: "#", icon: "sun" },
];

export const Header = (): JSX.Element => {
  const dispatch = useDispatch();

  const { connected, chainId, connect, disconnect, address } = useWeb3Context();
  const allowedChain = chainId && enabledNetworkIds.includes(chainId);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [flagAccountDropDown, setFlagAccountDropDown] = useState<null | HTMLElement>(
    null
  );
  const [checked, setChecked] = useState(false);
  const themeType = useSelector((state: RootState) => state.theme.mode);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const accountDrop = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (connected) {
      setFlagAccountDropDown(event.currentTarget);
    } else {
      onClickConnect();
    }
  };

  const toggleTheme = () => {
    dispatch(setTheme(themeType === "light" ? "dark" : "light"));
  };

  const onClickConnect = () => {
    connect(true, isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum);
  };

  const USDBBalance = useSelector((state: RootState) => {
    return truncateDecimals(Number(state.account.balances.usdb), 4).toString();
  });

  const onClickDisconnect = () => {
    disconnect();
    dispatch(logout());
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl" sx={{ pt: { xs: "1rem", md: "2.5rem" } }}>
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="div"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              fontSize: "28px",
              minWidth: "70px",
            }}
          >
            <Link to="/">
              <img src={logo} alt="liqd logo" style={{ height: "1.5em" }} />
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              className={`${styles["navWrap"]}`}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page: Page) => (
                <MenuLink
                  // href={page.href ? page.href : '#'}
                  href={page?.params?.comingSoon ? "#" : page.href}
                  onClick={handleCloseNavMenu}
                  key={page.title}
                >
                  <Typography
                    textAlign="center"
                    style={{ opacity: page?.params?.comingSoon ? 0.2 : 1 }}
                  >
                    <Button style={{ width: "100%" }}>{page.title}</Button>
                  </Typography>
                </MenuLink>
              ))}
            </Menu>
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Link to="/">
              <img src={logo} alt="liqd logo" style={{ height: "1.5em" }} />
            </Link>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              {pages.map((page: Page, index: number) => {
                return (
                  <Typography
                    key={`btn-${page.title}-${index}`}
                    textAlign="center"
                    style={{ opacity: page?.params?.comingSoon ? 0.2 : 1 }}
                  >
                    <Link to={page.href || "#"}>
                      <Button
                        style={{ minWidth: "110px", padding: "1em 1em" }}
                        onClick={(e) => {
                          if (page.title === "Account") {
                            accountDrop(e);
                          }
                        }}
                      >
                        {page.title}
                      </Button>
                    </Link>

                    {connected ? (
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
                          >
                            <LaunchIcon fontSize="small" />
                          </IconButton>
                        </div>
                        <div
                          style={{
                            background: "white",
                            padding: "10px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <img src={coin} alt="logo" width={40} height={40} />
                            <div className="amount" style={{ marginLeft: "10px" }}>
                              <p
                                style={{
                                  color: "grey",
                                  marginTop: "3px",
                                  marginBottom: "3px",
                                }}
                              >
                                Wallet Balance
                              </p>
                              <p style={{ marginTop: "3px", marginBottom: "3px" }}>
                                {USDBBalance}
                              </p>
                            </div>
                          </div>
                          <div className="show_balance">
                            <IconButton
                              size="small"
                              aria-label="copy address"
                              sx={{
                                width: 40,
                                height: 40,
                              }}
                            >
                              <VisibilityOffOutlinedIcon />
                            </IconButton>
                          </div>
                        </div>
                        <Button
                          variant="contained"
                          sx={{
                            mt: "20px",
                            mb: "20px",
                            width: "300px",
                            fontSize: "14px",
                          }}
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
                                  <CustomInnerSwitch onClick={toggleTheme} />
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
                                    {dropMenu.icon == "user" ? (
                                      <PersonOutlineOutlinedIcon />
                                    ) : dropMenu.icon == "photo" ? (
                                      <InsertPhotoOutlinedIcon />
                                    ) : dropMenu.icon == "loan" ? (
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
                    ) : null}
                  </Typography>
                );
              })}
            </Box>
          </Box>
          <NotificationMenu />
          <UserMenu />
        </Toolbar>
      </Container>
      {!allowedChain && connected && (
        <div className={styles["errorNav"]}>
          Network unsupported. Please change to one of: [Fantom, Ethereum]
        </div>
      )}
    </AppBar>
  );
};
