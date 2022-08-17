import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";

import FundsImg from "../../../assets/images/funds-img.png";
import OffersImg from "../../../assets/images/offers-img.png";

import BgCard from "../../../assets/images/bg-card.png";
import BgCardHover from "../../../assets/images/bg-card-hover.png";

export const BorrowerBanner = (): JSX.Element => {
  const [over, setOver] = useState(false);
  const toggleImage = () => {
    setOver(!over);
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "150px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          flexDirection: { sm: "column", xl: "row" },
        }}
      >
        <Box
          sx={{
            width: { xs: "360px", md: "495px" },
            height: { xs: "248px", md: "383px" },
          }}
        >
          <img style={{ width: "100%", height: "100%" }} src={OffersImg} alt="" />
        </Box>
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
            width="234"
            height="21"
            viewBox="0 0 234 21"
          >
            <g id="Group_12781" data-name="Group 12781" transform="translate(-330 -4962)">
              <text
                id="For_BORROWERS"
                data-name="For BORROWERS"
                transform="translate(360 4979)"
                fill="#8fa0c3"
                font-size="16"
                font-family="SegoeUI, Segoe UI"
                letter-spacing="0.4em"
              >
                <tspan x="0" y="0">
                  FOR BORROWERS
                </tspan>
              </text>
              <path
                id="Subtraction_4"
                data-name="Subtraction 4"
                d="M9,18v0a13.142,13.142,0,0,0-3.338-5.66A13.142,13.142,0,0,0,0,9,13.141,13.141,0,0,0,5.662,5.662,13.142,13.142,0,0,0,9,0a13.141,13.141,0,0,0,3.338,5.662A13.142,13.142,0,0,0,18,9a13.149,13.149,0,0,0-9,9Z"
                transform="translate(330 4964)"
                fill="#8fa0c3"
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
            Get the liquidity without selling your NFT
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              marginTop: "20px",
              gap: "10px",
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
            {[
              "Get funds without selling",
              "Borrow in crypto or stablecoins",
              "No credit checks neccessary",
              "Set your own loan terms and duration",
            ].map((v, i) => (
              <Typography
                key={i}
                sx={{
                  width: "144px",
                  fontSize: "18px",
                  color: "#8FA0C3",
                  fontFamily: "inter",
                }}
              >
                {v}
              </Typography>
            ))}
          </Box>
          <NavLink to="#">
            <Button
              sx={{
                width: "350px",
                height: "62px",
                border: "2px solid #374FFF",
                color: "#374FFF",
                borderRadius: "50px",
                fontFamily: "MonumentExtended",
                fontSize: "17px",
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: "25px",
                marginTop: "10px",
                marginInline: "auto",
                "&:hover": {
                  color: "#fff",
                },
                "&:hover .arrowSvg path": {
                  stroke: "#fff",
                },
              }}
            >
              <span>GET STARTED</span>
              <svg
                className="arrowSvg"
                xmlns="http://www.w3.org/2000/svg"
                width="27.609"
                height="18.718"
                viewBox="0 0 27.609 18.718"
              >
                <g
                  id="_8666606_arrow_right_icon"
                  data-name="8666606_arrow_right_icon"
                  transform="translate(0 0.707)"
                >
                  <path
                    id="Path_2948"
                    data-name="Path 2948"
                    d="M7.512,0H33.98"
                    transform="translate(-7.512 8.652)"
                    fill="none"
                    stroke="#374fff"
                    stroke-width="2"
                  />
                  <path
                    id="Path_2947"
                    data-name="Path 2947"
                    d="M12,5l8.652,8.652L12,22.3"
                    transform="translate(5.543 -5)"
                    fill="none"
                    stroke="#374fff"
                    stroke-width="2"
                  />
                </g>
              </svg>
            </Button>
          </NavLink>
        </Box>
        <Box
          sx={{
            width: { xs: "360px", md: "471px" },
            height: { xs: "265px", md: "376px" },
          }}
        >
          <img style={{ width: "100%", height: "100%" }} src={FundsImg} alt="" />
        </Box>
      </Box>
    </Box>
  );
};

export default BorrowerBanner;
