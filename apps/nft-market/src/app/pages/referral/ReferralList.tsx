import { Box, Typography, Avatar } from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import AvatarPlaceholder from "../../../assets/images/temp-avatar.png";
import { useMediaQuery } from "@material-ui/core";
import { addressEllipsis } from "@fantohm/shared-helpers";

export const ReferralList = (): JSX.Element => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const referredList = [
    "0xc09eAC15f9Ba6462e8E4612af7C431E1cfe08b87",
    "0xc09eAC15f9Ba6462e8E4612af7C431E1cfe08b87",
    "0xc09eAC15f9Ba6462e8E4612af7C431E1cfe08b87",
    "0xc09eAC15f9Ba6462e8E4612af7C431E1cfe08b87",
  ];
  //   const referredList: any[] = [];

  const openLink = (address: string) => {
    window.open(`https://etherscan.io/address/${address}`, "_blank");
  };

  return (
    <Box>
      <Box display={"flex"} flexDirection={"row"} alignItems="center">
        <Typography variant="subtitle2" component="span">
          Accounts you've referred
        </Typography>
        <Box ml={1} display={"flex"}>
          <InfoIcon />
        </Box>
      </Box>
      <Box mt={2} sx={{ display: "flex" }}>
        {referredList && referredList.length > 0 ? (
          <Box>
            {referredList.map((item, index) => (
              <Box key={`referred-accounts-${index}`} onClick={() => openLink(item)}>
                {
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gridGap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <Box sx={{ display: "block" }}>
                      <Avatar
                        sx={{ mr: { sm: "0" }, borderRadius: "2rem" }}
                        src={AvatarPlaceholder}
                      ></Avatar>
                    </Box>
                    <Typography variant="caption" component="span">
                      {isDesktop ? item : addressEllipsis(item)}
                    </Typography>
                  </Box>
                }
              </Box>
            ))}
          </Box>
        ) : (
          <Typography style={{ margin: "auto" }} variant="caption" component="span">
            You haven’t referred anyone yet
          </Typography>
        )}
      </Box>
    </Box>
  );
};
