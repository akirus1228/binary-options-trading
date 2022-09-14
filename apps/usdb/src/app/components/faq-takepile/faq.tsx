import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import style from "./faq.module.scss";
import { ExpandMore } from "@mui/icons-material";

const faqItems = [
  { title: "What is Takepile?", link: "https://www.youtube.com/embed/83UDk-bITYw" },
  {
    title: "Where does the APR come from?",
    link: "https://www.youtube.com/embed/ZSEL6IirDR4",
  },
  {
    title: "How does takepile guarantee solvency?",
    link: "https://www.youtube.com/embed/bKa4XknGmWg",
  },
  {
    title: "What makes Takepile different?",
    link: "https://www.youtube.com/embed/24f93z2R354",
  },
  {
    title: "How does Takepile scale?",
    link: "https://www.youtube.com/embed/PFYHG0y1Dqw",
  },
  {
    title: "How does Takepile get prices for different pairs?",
    link: "https://www.youtube.com/embed/zuXtn_KQgKs",
  },
];

export const Faq = (): JSX.Element => {
  return (
    <Box className="flexCenterCol">
      <Typography className={style["faqHeader"]}>Frequently Asked Questions</Typography>
      {faqItems.map(({ title, link }, key: number) => (
        <Accordion
          key={`faq-acc-${key}`}
          className={style["faqItem"]}
          style={{
            background: "#20203088",
            borderRadius: "30px",
            padding: "15px",
            paddingLeft: "40px",
            paddingRight: "20px",
            marginBottom: "25px",
          }}
        >
          <AccordionSummary
            className={style["faqTitle"]}
            expandIcon={<ExpandMore color="primary" />}
          >
            {title}
          </AccordionSummary>
          <AccordionDetails className={style["faqContent"]}>
            <iframe
              src={link}
              width="100%"
              height="305"
              frameBorder="0"
              allowFullScreen
              title={title}
            ></iframe>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Faq;
