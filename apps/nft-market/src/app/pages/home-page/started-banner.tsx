import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";

import BgStarted from "../../../assets/images/bg-started.png";
import BgCard from "../../../assets/images/bg-card.png";
import BgCardHover from "../../../assets/images/bg-card-hover.png";

export const StartedBanner = (): JSX.Element => {
  const [over, setOver] = useState(false);
  const toggleImage = () => {
    setOver(!over);
  };
  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "150px",
        marginBottom: "200px",
        backgroundImage: `url('${BgStarted}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "360px", sm: "376px", md: "717px" },
          height: { xs: "480px", md: "323px" },
          position: "relative",
          textAlign: "center",
        }}
        onMouseOver={toggleImage}
        onMouseOut={toggleImage}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: { xs: "none", md: "block" },
            position: "absolute",
          }}
        >
          <img
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              zIndex: "-1",
              width: "100%",
              height: "100%",
            }}
            src={over ? BgCardHover : BgCard}
            alt=""
          />
        </Box>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="188"
          height="21"
          viewBox="0 0 188 21"
        >
          <g id="Group_12706" data-name="Group 12706" transform="translate(-21 -12)">
            <text
              id="Get_started"
              data-name="Get started"
              transform="translate(50 29)"
              fill="#374fff"
              font-size="16"
              font-family="SegoeUI, Segoe UI"
              letter-spacing="0.4em"
            >
              <tspan x="0" y="0">
                GET STARTED
              </tspan>
            </text>
            <path
              id="Subtraction_4"
              data-name="Subtraction 4"
              d="M10.419,20.837v0a15.213,15.213,0,0,0-3.864-6.552A15.213,15.213,0,0,0,0,10.419,15.213,15.213,0,0,0,6.554,6.554,15.213,15.213,0,0,0,10.419,0a15.213,15.213,0,0,0,3.865,6.554,15.213,15.213,0,0,0,6.554,3.865A15.221,15.221,0,0,0,10.419,20.835Z"
              transform="translate(21 12)"
              fill="#374fff"
            />
          </g>
        </svg>
        <Typography
          sx={{
            fontSize: { xs: "28px", xl: "28px" },
            color: "#CAD6EE",
            height: { xs: "200px", md: "120px" },
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "MonumentExtended",
          }}
        >
          Are you ready to get started with Liqd?
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Typography
            sx={{
              width: "80%",
              fontSize: "18px",
              color: "#8FA0C3",
              fontFamily: "inter",
            }}
          >
            With ZERO fees for the first month, now is the time to utilise Liqd and get
            liquidity for your favourite NFTs without selling.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "20px",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <NavLink to="#">
            <Button
              sx={{
                width: { xs: "310px", md: "309px" },
                height: "62px",
                border: "2px solid #374FFF",
                color: "#fff",
                background: "#374FFF",
                borderRadius: "50px",
                fontFamily: "inter",
                fontSize: { xs: "14px", md: "17px" },
              }}
            >
              Launch App
            </Button>
          </NavLink>

          <NavLink to="#">
            <Button
              sx={{
                width: { xs: "310px", md: "309px" },
                height: "62px",
                border: "2px solid #374FFF",
                color: "#fff",
                borderRadius: "50px",
                fontFamily: "inter",
                fontSize: { xs: "14px", md: "17px" },
              }}
            >
              Join Discord
            </Button>
          </NavLink>
        </Box>
      </Box>
    </Box>
  );
};

export default StartedBanner;
