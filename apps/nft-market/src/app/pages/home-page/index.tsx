import HeroBanner from "./hero-banner";
import WorkBanner from "./work-banner";
import BorrowerBanner from "./borrower-banner";
import LendersBanner from "./lenders-banner";
import FaqBanner from "./faq-banner";
import StartedBanner from "./started-banner";

import { RootState } from "../../store";
import { useSelector } from "react-redux";

export const NewHomePage = (): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.theme.mode) as string;
  const isDark = themeType === "dark";
  return (
    <>
      <HeroBanner isDark={isDark} />
      <WorkBanner isDark={isDark} />
      <BorrowerBanner isDark={isDark} />
      <LendersBanner isDark={isDark} />
      <FaqBanner isDark={isDark} />
      <StartedBanner isDark={isDark} />
    </>
  );
};
