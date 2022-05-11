import { createTheme } from "@mui/material/styles";
import { AppBar, styled, Switch, ThemeOptions } from "@mui/material";
import { makeStyles } from "@mui/styles";
import lightBG from "./images/USDB_gradient_light.png";
import darkBG from "./images/USDB_gradient_dark.png";

export const noBorderOutlinedInputStyles = makeStyles((theme) => ({
  root: {
    "& $notchedOutline": {
      border: "none",
    },
    "&:hover $notchedOutline": {
      border: "none",
    },
    "&$focused $notchedOutline": {
      border: "none",
    },
  },
  focused: {},
  notchedOutline: {},
}));

// light color pallet for use in themes
const nftLightColors = {
  color: "#000",
  invertedColor: "#FFF",
  errorColor: "#CC335C",
  errorBackground: "#CC335C40",
  backgroundColor: "#fdfefe",
  paperBg: "#FFF",
  gray: "#696C80",
  iconButtonBg: "#181A1C0F",
};

// dark color pallet for use in themes
const nftDarkColors = {
  color: "#FFF",
  invertedColor: "#000",
  errorColor: "#CC335C",
  errorBackground: "#CC335C40",
  backgroundColor: "#000",
  paperBg: "#0E0F10",
  gray: "#929BA0",
  iconButtonBg: "#181A1CD4",
};

export const CustomInnerSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    backgroundColor: "#4f4ff2",
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 12,
    height: 12,
    margin: 4,
    backgroundColor: "#4f4ff2",
  },
}));

export const FooterBar = styled(AppBar)(({ theme }) => ({
  borderRadius: 0,
  padding: "2em 0",
  marginTop: 0,
  "& a": {
    color: "#FFF",
    fontSize: "14px",
    fontWeight: 400,
  },
}));

// global theme options that apply to both light and dark
const globalTheme: ThemeOptions = {
  palette: {
    action: {
      disabledBackground: "#696C8029",
      disabled: "#696C80",
    },
    text: {
      disabled: "#696C80",
    },
  },
  typography: {
    fontFamily: ["Sora", "Roboto", "sans-serif"].join(","),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          fontSize: "18px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "53px",
          padding: "2.5em",
          "&.MuiAppBar-root": {
            padding: "0",
          },
          "&.MuiMenu-paper": {
            marginTop: "1em",
            borderRadius: "10px",
            padding: "0.5em",
            boxShadow: "2px 12px 33px rgb(0 0 0 / 20%)",
          },
          "&.MuiAccordion-root, &.MuiAccordion-root:last-of-type": {
            padding: "1.75em 0 1em 0",
            borderRadius: "0",
          },
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          // background: 'rgba(100, 100, 100, 0.1)',
          // backdropFilter: 'blur(33px)',
          // '-webkit-backdrop-filter': 'blur(33px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "36px",
          padding: "1em 3em",
          fontSize: "1em",
          textTransform: "unset",
          "&.Mui-disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          },
        },
        outlined: {
          borderRadius: "36px",
          padding: "1em 3em",
          fontSize: "1em",
          borderWidth: "1px",
        },
        contained: {
          borderRadius: "36px",
          padding: "1em 3em",
          fontSize: "1em",
        },
      },
      defaultProps: {
        autoCapitalize: "none",
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: "2px solid #0000001F",
          borderRadius: "3em",
          fontSize: "12px",
          width: "125px",
          padding: "0.5em 2em",
          textTransform: "none",
          height: "fit-content",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "unset",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: "transparent",
          "&.Mui-expanded": {
            margin: "0",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontSize: "2em",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          textAlign: "left",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "&.heroBackground": {
          backgroundPosition: "top 0 right 50%",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        },
      },
    },
  },
};

// light theme
const USDBLightBase: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: nftLightColors.color,
      contrastText: nftLightColors.invertedColor,
    },
    secondary: {
      main: nftLightColors.invertedColor,
      contrastText: nftLightColors.color,
    },
    background: {
      default: nftLightColors.backgroundColor,
      paper: nftLightColors.paperBg,
    },
    text: {
      primary: nftLightColors.color,
      secondary: nftLightColors.gray,
    },
    error: {
      main: nftLightColors.errorColor,
      light: nftLightColors.errorBackground,
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          color: nftLightColors.color,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.paperButton": {
            color: "#FFF",
            backgroundColor: "#000",
          },
          "&.menuButton": {
            border: "1px solid #000",
          },
          "&.border": {
            border: "1px solid #000",
            color: "#000",
          },
        },
        outlined: {
          "&, &:hover": {
            border: "2px solid #000",
          },
        },
        contained: {
          "&.closeButton": {
            color: nftLightColors.color,
            background: nftLightColors.iconButtonBg,
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: nftLightColors.color,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: nftLightColors.color,
          "&.softGradient": {
            background:
              "linear-gradient(45deg, rgba(229,229,235,1) 15%, rgba(229,229,235,0.42) 90%)",
          },
          "&.MuiAccordion-root": {
            borderBottom: "2px solid #00000040",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "&.heroBackground": {
          backgroundImage: `url(${lightBG})`,
        },
      },
    },
  },
};

// dark theme
const USDBDarkBase: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: nftDarkColors.color,
      contrastText: nftDarkColors.invertedColor,
    },
    secondary: {
      main: nftDarkColors.invertedColor,
      contrastText: nftDarkColors.color,
    },
    background: {
      default: nftDarkColors.backgroundColor,
      paper: nftDarkColors.paperBg,
    },
    text: {
      primary: nftDarkColors.color,
      secondary: nftDarkColors.gray,
    },
    error: {
      main: nftDarkColors.errorColor,
      light: nftDarkColors.errorBackground,
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          color: nftDarkColors.color,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.paperButton": {
            color: "#FFF",
            backgroundColor: "#000",
          },
          "&.menuButton": {
            border: "1px solid #FFF",
          },
          "&.border": {
            border: "1px solid #FFF",
            color: "#FFF",
          },
          "&.Mui-disabled": {
            color: nftDarkColors.gray,
          },
        },
        outlined: {
          "&, &:hover": {
            border: "2px solid #FFF",
          },
        },
        contained: {
          "&.closeButton": {
            color: nftDarkColors.color,
            background: nftDarkColors.iconButtonBg,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: nftDarkColors.color,
          "&.softGradient": {
            background:
              "linear-gradient(45deg, rgba(8,9,10,1) 0%, rgba(8,9,10,0.62) 5%, rgba(14,15,16,1) 90%)",
          },
          "&.MuiAccordion-root": {
            borderBottom: "2px solid #FFFFFF40",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "&.heroBackground": {
          backgroundImage: `url(${darkBG})`,
        },
      },
    },
  },
};

export const NftLight = createTheme(globalTheme, USDBLightBase);
export const NftDark = createTheme(globalTheme, USDBDarkBase);