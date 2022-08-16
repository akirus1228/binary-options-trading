import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { setTheme } from "@fantohm/shared-ui-themes";
import HeroBanner from "./hero-banner";
import WorkBanner from "./work-banner";

export const NewHomePage = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  dispatch(setTheme("dark"));

  return (
    <>
      <HeroBanner />
      <WorkBanner />
    </>
  );
};
