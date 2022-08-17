import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const FaqBanner = (): JSX.Element => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Box sx={{ width: "100%", marginTop: "100px", textAlign: "center" }}>
      <Typography sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#374FFF" }}>
        FAQs
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "30px", xl: "35px" },
          color: "#CAD6EE",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "MonumentExtended",
          marginTop: "20px",
        }}
      >
        Frequently asked questions
      </Typography>
      <Card
        sx={{ maxWidth: 831, marginInline: "auto", marginTop: "20px", boxShadow: "none" }}
      >
        <CardActions disableSpacing>
          <Typography
            sx={{ fontSize: { xs: 18, sm: 25 }, fontFamily: "inter", color: "#DEE9FF" }}
          >
            What are borrowing rates?
          </Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon sx={{ color: "#C7D5FF", fontSize: "36px" }} />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography
              sx={{
                fontSize: 18,
                fontFamily: "inter",
                color: "#8FA0C3",
                textAlign: "left",
              }}
            >
              The annualized borrowing rates are typically ranging from 12 to 15%,
              depending on the market conditions and your specific NFT.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
      <Card
        sx={{ maxWidth: 831, marginInline: "auto", marginTop: "20px", boxShadow: "none" }}
      >
        <CardActions disableSpacing>
          <Typography
            sx={{ fontSize: { xs: 18, sm: 25 }, fontFamily: "inter", color: "#DEE9FF" }}
          >
            What is a loan-to-value (LTV) ratio?
          </Typography>
        </CardActions>
      </Card>
      <Card
        sx={{ maxWidth: 831, marginInline: "auto", marginTop: "20px", boxShadow: "none" }}
      >
        <CardActions disableSpacing>
          <Typography
            sx={{ fontSize: { xs: 18, sm: 25 }, fontFamily: "inter", color: "#DEE9FF" }}
          >
            Where does my NFT go?
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default FaqBanner;
