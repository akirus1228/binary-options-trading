import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import { Link } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { HashLink } from "react-router-hash-link";

import infoSvg from "../../../../assets/icons/info.svg";
import infoClosePng from "../../../../assets/images/info-close.png";
import infoIconPng from "../../../../assets/images/info-icon.png";
import Typography from "@mui/material/Typography";

export const InfoBtn = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box
      sx={{
        position: "absolute",
        right: 20,
        bottom: 10,
        zIndex: 10,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          background: "#16181A !important",
          width: { xs: "49px", lg: "64px" },
          height: { xs: "49px", lg: "64px" },
        }}
        aria-controls={open ? "info-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          sx={{ width: { xs: "29px", lg: "37px" }, height: { xs: "29px", lg: "37px" } }}
          src={infoSvg}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="info-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: "#16181A",
            overflow: "visible",
            width: "406px",
            height: "142px",
            top: "auto !important",
            bottom: { xs: "68px", lg: "84px" },
            "& ul": {
              padding: "5px 10px",
              margin: 0,
            },
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ color: "#fff" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "20px" }}>Need some help?</Typography>
            <Avatar
              sx={{ width: "23px", height: "23px" }}
              onClick={handleClose}
              src={infoClosePng}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              mt: "10px",
            }}
          >
            <Avatar
              sx={{ width: "23px", height: "23px" }}
              onClick={handleClose}
              src={infoIconPng}
            />
            <Typography sx={{ fontSize: "14px" }}>
              Need help getting started? Click{" "}
              <HashLink
                to="/lend"
                onClick={handleClose}
                style={{ color: "#fff", borderBottom: "1px solid #fff" }}
              >
                here
              </HashLink>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              mt: "10px",
            }}
          >
            <Avatar
              sx={{ width: "23px", height: "23px" }}
              onClick={handleClose}
              src={infoIconPng}
            />
            <Typography sx={{ fontSize: "14px" }}>
              Report an issue or bug{" "}
              <Link
                href="https://liqd.nolt.io"
                style={{ color: "#fff", borderBottom: "1px solid #fff" }}
                target="_blank"
                onClick={handleClose}
              >
                here
              </Link>
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            background: "#374FFF",
            width: "319px",
            height: "9px",
            position: "absolute !important",
            left: "-8px",
            bottom: " -28px",
            borderBottomLeftRadius: "25px",
          }}
        ></Box>
      </Menu>
    </Box>
  );
};
