import { NorthEast } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import style from "./balance-vault-details-page.module.scss";

export type ExternalLinkProps = {
  href: string;
  title: string;
};

export const ExternalLink = ({ href, title }: ExternalLinkProps) => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const lowContrastBg =
    themeType === "light"
      ? style["low-contrast-bg-light"]
      : style["low-contrast-bg-light"];
  const lowContrastText =
    themeType === "light"
      ? style["low-contrast-text-light"]
      : style["low-contrast-text-light"];

  return (
    <Box
      sx={{ p: "0.75em" }}
      className={`flex fr jf-c ai-c rounded ${lowContrastBg} ${lowContrastText}`}
    >
      <Link to={href}>
        <span className={lowContrastText}>{title}</span>
      </Link>
      <NorthEast />
    </Box>
  );
};
