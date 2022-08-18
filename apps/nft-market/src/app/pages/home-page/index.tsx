import HeroBanner from "./hero-banner";
import WorkBanner from "./work-banner";
import BorrowerBanner from "./borrower-banner";
import LendersBanner from "./lenders-banner";
import FaqBanner from "./faq-banner";
import StartedBanner from "./started-banner";

export const NewHomePage = (): JSX.Element => {
  return (
    <>
      <HeroBanner />
      <WorkBanner />
      <BorrowerBanner />
      <LendersBanner />
      <FaqBanner />
      <StartedBanner />
    </>
  );
};
