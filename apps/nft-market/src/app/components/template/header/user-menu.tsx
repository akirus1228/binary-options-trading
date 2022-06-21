import { CustomInnerSwitch, setTheme } from "@fantohm/shared-ui-themes";
import {
  addresses,
  formatCurrency,
  isDev,
  loadErc20Balance,
  NetworkIds,
  selectErc20BalanceByAddress,
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
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
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
import { selectCurrencyByAddress } from "../../../store/selectors/currency-selectors";
import { selectListingsByAddress } from "../../../store/selectors/listing-selectors";
import { Listing, ListingStatus } from "../../../types/backend-types";
import ManageFund from "../../managefund/managefund";
import { useTermDetails } from "../../../hooks/use-term-details";

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

  const usdbBalance = useSelector((state: RootState) =>
    selectErc20BalanceByAddress(state, addresses[desiredNetworkId]["USDB_ADDRESS"])
  );

  const accountSubMenu: AccountSubMenu[] = [
    { title: "My profile", href: "/my-account", icon: "user" },
    { title: "My assets", href: "#", icon: "photo" },
    { title: "My loans", href: "#", icon: "loan" },
    { title: "Dark theme", href: "#", icon: "sun" },
  ];

  // web3 wallet
  const { connect, disconnect, connected, address } = useWeb3Context();

  useEffect(() => {
    if (!address) return;
    dispatch(
      loadErc20Balance({
        networkId: desiredNetworkId,
        address,
        currencyAddress: addresses[desiredNetworkId]["USDB_ADDRESS"],
      })
    );
  }, [address]);

  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    connect(true, isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum);
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
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };
  const location = useLocation();
  const address1 = location.pathname.split("/");
  const listings = useSelector((state: RootState) => {
    if (!address1[2] && !address1[3]) return null;
    return selectListingsByAddress(state, {
      // contractAddress: params["contractAddress"] || "123",
      // tokenId: params["tokenId"] || "123", 0x90267036ed282cce0a1488d19db22a04171cfbfc,26
      contractAddress: address1[2],
      tokenId: address1[3],
    });
  });

  //find listing from store

  const activeListing = useMemo(() => {
    if (!listings) return null;
    return listings.find((listing: Listing) => listing.status === ListingStatus.Listed);
  }, [listings]);
  const currency = useSelector((state: RootState) => {
    if (!activeListing) return null;
    return selectCurrencyByAddress(state, activeListing.term.currencyAddress);
  });
  const currencyBalance = useSelector((state: RootState) => {
    if (!currency) return null;
    return selectErc20BalanceByAddress(state, currency?.currentAddress);
  });

  // make offer code
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleManageFund = () => {
    setDialogOpen(true);
  };

  const onListDialogClose = (accepted: boolean) => {
    setDialogOpen(false);
  };

  const { repaymentTotal } = useTermDetails(activeListing?.term);

  return connected ? (
    <>
      <Button
        id="user-menu-button"
        aria-controls={flagAccountDropDown ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={flagAccountDropDown ? "true" : undefined}
        onClick={accountDrop}
        sx={{ background: "#FFF", py: "0.5em", fontSize: "16px" }}
      >
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Avatar sx={{ mr: "1em" }} src={AvatarPlaceholder}></Avatar>
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
            href={`https://etherscan.io/address/${address}`}
            target='_blank'
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </div>
        <div
          style={{
            background: "white",
            padding: "5px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Container style={{ width: "320px" }}>
              <Paper
                style={{
                  marginTop: "5px",
                  marginBottom: "5px",
                  padding: "1em",
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
                <h4
                  style={{
                    marginLeft: "10px",
                    marginTop: "5px",
                    marginBottom: "1px",
                  }}
                >
                  {listings &&
                    listings.length > 0 &&
                    currencyBalance &&
                    formatCurrency(
                      +ethers.utils.formatUnits(currencyBalance, currency?.decimals || 18)
                    )}{" "}
                  {(listings && currency?.symbol) || ""}
                  {!listings &&
                    !!usdbBalance &&
                    formatCurrency(+ethers.utils.formatUnits(usdbBalance, "ether"))}
                  {!listings && " USDB"}
                </h4>
              </Paper>
              {listings && listings.length > 0 && (
                <Paper
                  style={{
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "1em",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
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
                        {repaymentTotal.toFixed(2)} {(listings && currency?.symbol) || ""}
                      </h4>
                    </div>
                    <ManageFund
                      onClose={onListDialogClose}
                      open={dialogOpen}
                      listing={activeListing}
                      asset={activeListing?.asset}
                    />
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
                      manage
                    </Button>
                  </Box>
                </Paper>
              )}
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
