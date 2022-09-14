//import style from "./my-account-page.module.scss";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { useSelector } from "react-redux";
import { useImpersonateAccount } from "@fantohm/shared-web3";
import { RootState } from "../../store";
import { AccountProfile } from "./account-profile/account-profile";
import { ReactNode, SyntheticEvent, useMemo } from "react";
import MyAccountLoans from "./my-account-loans/my-account-loans";
import MyAccountDetails from "./my-account-details/my-account-details";
import MyAccountOffers from "./my-account-offers/my-account-offers";
import MyAccountAssets from "./my-account-assets/my-account-assets";
import MyAccountActivity from "./my-account-activity/my-account-activity";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import style from "./my-account-page.module.scss";

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type TabPanelProps = {
  children?: ReactNode;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

type TabContent = {
  title: string;
  path: string;
  component: JSX.Element;
  isGlobal: boolean;
};

export const MyAccountPage = (): JSX.Element => {
  const { impersonateAddress, isImpersonating } = useImpersonateAccount();
  const params = useParams();
  const { user } = useSelector((state: RootState) => state.backend);
  const location = useLocation();
  const navigate = useNavigate();

  const address = useMemo(() => {
    return !!params["walletAddress"] && params["walletAddress"].length > 1
      ? params["walletAddress"]
      : user.address ?? "";
  }, [user, params["walletAddress"]]);
  const userAddress = isImpersonating ? impersonateAddress : address;

  const tabs: TabContent[] = [
    {
      title: "Details",
      path: "detail",
      component: <MyAccountDetails address={userAddress} />,
      isGlobal: true,
    },
    {
      title: "Loans",
      path: "loans",
      component: <MyAccountLoans />,
      isGlobal: false,
    },
    {
      title: "Offers",
      path: "offers",
      component: <MyAccountOffers />,
      isGlobal: false,
    },
    {
      title: "Assets",
      path: "assets",
      component: <MyAccountAssets address={userAddress} />,
      isGlobal: true,
    },
    {
      title: "Activity",
      path: "activity",
      component: <MyAccountActivity />,
      isGlobal: false,
    },
  ];

  const tab = params["tab"] || "detail";
  const activeTab = tabs.findIndex((_tab) => _tab.path === tab);

  if (activeTab === -1) {
    navigate("/my-account");
  }

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    let newPath: string;
    if (params["tab"]) {
      newPath = location.pathname.split("/").slice(0, -1).join("/");
    } else {
      newPath = location.pathname;
    }
    navigate(`${newPath}/${tabs[newValue].path}${location.search}`);
  };

  if (typeof address === "undefined" || !address) {
    return (
      <Box>
        <h1>Not logged in</h1>
        <p>Please connect to view your account</p>
      </Box>
    );
  }

  return (
    <Box>
      <Container>
        <AccountProfile address={userAddress} />
      </Container>
      <Box sx={{ borderBottom: 2, borderColor: "rgba(126, 154, 169, 0.20)", mb: "5em" }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          {tabs
            .filter(
              (tab: TabContent) => tab.isGlobal || (!!user && !params["walletAddress"])
            )
            .map((tab: TabContent, tabIndex: number) => (
              <Tab
                label={
                  <div
                    style={{
                      fontFamily: "Inter,Roboto,sans-serif",
                      fontWeight: "500",
                      fontSize: "1.2em",
                      color: tabIndex === activeTab ? "black" : "#8991A2",
                      padding: "8px 0px",
                      minWidth: "120px",
                    }}
                  >
                    {tab.title}
                  </div>
                }
                {...a11yProps(tabIndex)}
                key={`tab-${tabIndex}`}
                className={style["tabElem"]}
              />
            ))}
        </Tabs>
      </Box>
      {tabs
        .filter((tab: TabContent) => tab.isGlobal || (!!user && !params["walletAddress"]))
        .map((tab: TabContent, tabIndex: number) => (
          <TabPanel value={activeTab} index={tabIndex} key={`tabPanel-${tabIndex}`}>
            {tab.component}
          </TabPanel>
        ))}
    </Box>
  );
};

export default MyAccountPage;
