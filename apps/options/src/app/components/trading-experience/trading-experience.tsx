import ArrowIcon from "../arrow-icon/arrow-icon";

const TradingExperience = () => {
  return (
    <div className="trading-experience bg-bunker px-60 flex xs:flex-col sm:flex-row  sm:justify-between xs:items-center mt-90 rounded-2xl relative">
      <div className="flex flex-col justify-between py-40">
        <p className="experience-title xs:text-30 lg:text-40 text-primary w-280">
          24 hour trading experience
        </p>
        <p className="xs:text-15 lg:text-19 text-second my-40">Trade anywhere, anytime</p>
        <ArrowIcon text="ENTER APP" revert={true} status={"up"} />
      </div>
      <div className="sm:absolute token-logo items-center xs:w-250 sm:w-300 lg:w-380 bottom-0 sm:right-25 sm:flex sm:justify-center">
        <img src={`./assets/images/trading-experience.png`} alt={`experience logo`}/>
      </div>
    </div>
  );
};

export default TradingExperience;
