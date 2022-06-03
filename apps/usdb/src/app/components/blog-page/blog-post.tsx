import { Box, Grid, Paper, SxProps, Theme, ThemeProvider } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { RootState } from "../../store";
import style from "./blog-post.module.scss";
import { BalanceLogoDark, BalanceTwitter } from "@fantohm/shared/images";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BlogPostDTO } from "../../../../../nft-market/src/app/types/backend-types";

/* eslint-disable-next-line */
export interface BlogPostProps {
  children: JSX.Element | Array<JSX.Element>;
  className?: string;
  invertTheme?: boolean;
  setTheme?: "light" | "dark";
  tokenImage?: string;
  sx?: SxProps<Theme>;
  post: BlogPostDTO;
}

export const BlogPost = (props: BlogPostProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const theme = useCallback(() => {
    if (props.invertTheme) {
      return themeType === "light" ? USDBDark : USDBLight;
    } else if (props.setTheme) {
      return props.setTheme === "light" ? USDBLight : USDBDark;
    } else {
      return themeType === "light" ? USDBLight : USDBDark;
    }
  }, [themeType, props.invertTheme, props.setTheme]);

  return (
    <ThemeProvider theme={theme}>
      <Paper
        sx={{ marginTop: "47px", ...props.sx }}
        className={`daiCard ${style["cardWrapper"]} ${props.className} flexCenterCol`}
      >
        <Grid
          container
          sx={{ width: { xs: "100%", md: "100%" }, height: "100%" }}
          columnSpacing={2}
          rowSpacing={{ xs: 4, md: 0 }}
          direction="row"
        >
          <Grid
            item
            className="email-div"
            md={8}
            order={{ lg: 1 }}
            style={{ height: "100%", overflow: "hidden" }}
          >
            <img src={BalanceLogoDark} alt="DAI token" className={style["daiIcon"]} />
            <Box
              className={style["titleWrapper"]}
              style={{
                height: "30px",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  width: "100%",
                  height: "100%",
                  paddingTop: "5px",
                  fontSize: "12px",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                Product
              </h3>
            </Box>
          </Grid>
          <Grid
            item
            className="email-div"
            md={4}
            order={{ lg: 1 }}
            style={{ height: "100%", overflow: "hidden" }}
          />
          <Grid
            item
            className="email-div"
            md={12}
            order={{ lg: 1 }}
            style={{ height: "10%", overflow: "hidden", width: "100%" }}
          >
            <h1 style={{ fontSize: "16px" }}>
              {props.post ? props.post.blogTitle : "title"}
            </h1>
          </Grid>
          <Grid
            item
            className="email-div"
            md={3}
            order={{ lg: 1 }}
            style={{ width: "30px", justifyContent: "center" }}
          >
            <img src={BalanceTwitter} style={{ width: "60px" }} />
          </Grid>
          <Grid
            item
            className="email-div"
            md={6}
            order={{ lg: 1 }}
            sx={{ height: "100%", overflow: "hidden", marginLeft: { xs: "30px" } }}
          >
            <h2 style={{ fontSize: "12px", marginLeft: "10px" }}>
              {props.post ? props.post.blogTitle : "title"}
            </h2>
            <h2 style={{ fontSize: "12px", marginLeft: "10px" }}>
              {props.post ? props.post.blogTitle : "title"}
            </h2>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default BlogPost;
