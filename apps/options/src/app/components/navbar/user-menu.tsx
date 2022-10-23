import {
  isDev,
  loadErc20Balance,
  NetworkIds,
  networks,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { Avatar, Box, Button, Icon } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { MouseEvent, useMemo, useState } from "react";
import { addressEllipsis } from "@fantohm/shared-helpers";
import AvatarPlaceholder from "../../../../assets/images/avatar-account.png";
import { desiredNetworkId } from "../../core/constants/network";

export const UserMenu = (): JSX.Element => {
  const [flagAccountDropDown, setFlagAccountDropDown] = useState<null | HTMLElement>(
    null
  );
  const { connect, disconnect, address, connected, chainId } = useWeb3Context();
  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    console.log("connect: ", isDev, desiredNetworkId, address, isWalletConnected);
    try {
      connect(true, isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);
    } catch (e: unknown) {
      console.warn(e);
    }
  };

  const onClickDisconnect = () => {
    disconnect();
  };

  const accountDrop = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagAccountDropDown(event.currentTarget);
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

  const isWalletConnected = useMemo(() => {
    return address && connected && chainId === desiredNetworkId;
  }, [address, connected, chainId]);

  return isWalletConnected ? (
    <Button
      id="user-menu-button"
      aria-controls={flagAccountDropDown ? "user-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={flagAccountDropDown ? "true" : undefined}
      onClick={accountDrop}
      sx={{ background: "#FFF", py: "0.5em", fontSize: "16px" }}
      className="px-10 border-[#8080801f]"
    >
      <Box sx={{ display: "block" }}>
        <Avatar
          sx={{ mr: { sm: "0", md: "1em" }, borderRadius: "2rem" }}
          src={AvatarPlaceholder}
        ></Avatar>
      </Box>
      {addressEllipsis(address)}
      <Box sx={{ display: "flex", alignItems: "center", ml: { xs: "0.2em", sm: "1em" } }}>
        <Icon component={ArrowDropDownIcon}></Icon>
      </Box>
    </Button>
  ) : (
    <button
      className="rounded-2xl bg-success text-16 text-primary p-10 font-bold"
      onClick={(e) => {
        onClickConnect(e);
      }}
    >
      ConnectWallet
    </button>
  );
};

export default UserMenu;
