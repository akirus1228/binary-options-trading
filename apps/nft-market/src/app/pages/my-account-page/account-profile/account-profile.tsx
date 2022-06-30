import { Box, Button, Icon, IconButton } from "@mui/material";
import profileImagePlaceholder from "../../../../assets/images/profile-placeholder.svg";
import style from "./account-profile.module.scss";
import { addressEllipsis, copyToClipboard } from "@fantohm/shared-helpers";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IosShareIcon from "@mui/icons-material/IosShare";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import bluechip from "../../../../assets/icons/blue-chip.svg";
import openseaIcon from "../../../../assets/icons/opensea-icon.svg";
import raribleIcon from "../../../../assets/icons/rarible-icon.svg";
import { AppDispatch } from "../../../store";
import { useDispatch } from "react-redux";
import { addAlert, GrowlNotification } from "../../../store/reducers/app-slice";
import { isDev } from "@fantohm/shared-web3";

export type AccountProfileProps = {
  address: string;
};

export const AccountProfile = ({ address }: AccountProfileProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  const handleCopyAddress = () => {
    copyToClipboard(address);
    const notification: Partial<GrowlNotification> = {
      message: "Address copied to clipboard",
      duration: 5000,
    };
    dispatch(addAlert(notification));
  };

  const handleShareLink = () => {
    const baseUrl = isDev() ? "https://mvp.liqdnft.com" : "https://liqdnft.com";
    const copyString = `${baseUrl}/account/${address}`;
    copyToClipboard(copyString);
    const notification: Partial<GrowlNotification> = {
      message: "Share link copied to clipboard",
      duration: 5000,
    };
    dispatch(addAlert(notification));
  };

  return (
    <Box sx={{ mb: "5em" }}>
      <Box className={`flex fr fj-sb ai-c fw`}>
        <Box className={`flex fr fj-sb ai-c fw ${style["left"]}`}>
          <Box className={`${style["profileImageContainer"]} flex fr ai-c`}>
            <img
              src={profileImagePlaceholder}
              style={{ marginLeft: "5px" }}
              alt="User's profile avatar"
            />
          </Box>
          <Box className="flex fc" sx={{ ml: "2em" }}>
            <h1>
              {addressEllipsis(address)}
              <img src={bluechip} alt="bluechip" />
            </h1>
            <Button
              className="lowContrast slim"
              variant="contained"
              onClick={handleCopyAddress}
            >
              {addressEllipsis(address)}{" "}
              <Icon component={ContentCopyIcon} sx={{ ml: "1em" }} />
            </Button>
          </Box>
        </Box>
        <Box className={`flex fr ai-c ${style["right"]}`}>
          <a href={`https://opensea.io/${address}`} target="_blank" rel="noreferrer">
            <img src={openseaIcon} alt="opensea icon" className={style["iconWrapper"]} />
          </a>
          <a
            href={`https://rarible.com/user/${address}/owned`}
            target="_blank"
            rel="noreferrer"
          >
            <img src={raribleIcon} alt="opensea icon" className={style["iconWrapper"]} />
          </a>
          <Button
            className="lowContrast slim"
            variant="contained"
            sx={{ ml: "7px" }}
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
          >
            <Icon component={OpenInNewIcon} /> View on Etherscan
          </Button>
          <Button
            className="slim lowContrast"
            variant="contained"
            sx={{ ml: "7px" }}
            onClick={handleShareLink}
          >
            <Icon component={IosShareIcon} /> Share
          </Button>
          <IconButton className="lowContrast" sx={{ ml: "7px" }}>
            <Icon component={MoreHorizOutlinedIcon} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
