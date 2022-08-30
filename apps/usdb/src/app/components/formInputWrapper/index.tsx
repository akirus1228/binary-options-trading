import { Box, Typography } from "@mui/material";
import style from "./style.module.scss";

export interface Props {
  title: string;
  className?: string;
  children: any;
}

export const FormInputWrapper = (props: Props): JSX.Element => {
  const { title, className, children } = props;

  return (
    <Box className={className}>
      <Box>
        <Box
          sx={{
            display: "flex",
            backgroundColor: "black",
            width: "fit-content",
            marginLeft: "20px",
            zIndex: "10",
            position: "relative",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              color: "#8a99a8",
              margin: "0 28px 0 18px",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            mt: "-15px",
            border: "solid 1px #101112",
            borderRadius: "25px",
            width: "100%",
            padding: "20px 20px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default FormInputWrapper;
