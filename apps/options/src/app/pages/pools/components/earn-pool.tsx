import { SvgIcon, Box, Typography } from "@mui/material";
import {
  NorthEastRounded,
  AddRounded,
  RemoveRounded,
  ErrorOutlineRounded,
} from "@mui/icons-material";
import LinearProgress, {
  linearProgressClasses,
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { useState } from "react";

import { LabelIcon } from "../../../components/label-icon/label-icon";
import DAIImage from "../../../../assets/images/DAI.png";

export const EarnPool = (): JSX.Element => {
  const [active, setActive] = useState(true);
  const handleDeposit = () => {
    setActive(!active);
  };

  const handleWithdraw = () => {
    setActive(!active);
  };

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.mode === "light" ? "#151C1F" : "#308fe8",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#12B3A8" : "#308fe8",
    },
  }));

  function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box>
          <Typography variant="body2" className="text-second">
            23
          </Typography>
        </Box>
        <Box sx={{ width: "100%", mr: 2, ml: 2 }}>
          <BorderLinearProgress variant="determinate" {...props} />
        </Box>
        <Box>
          <Typography variant="body2" className="text-second">
            24&nbsp;hours
          </Typography>
        </Box>
      </Box>
    );
  }

  const PoolAction = () => (
    <div
      className={`w-full grid grid-cols-2 grid-rows-1 xs:text-20 md:text-16 cursor-default`}
    >
      <div
        className={`flex justify-center rounded-lg py-10 px-20 ${
          active ? "bg-bunker text-primary" : "bg-woodsmoke text-second"
        } hover:bg-bunker hover:text-primary  mr-10`}
        onClick={handleDeposit}
      >
        <SvgIcon component={AddRounded} />
        <p className="ml-5">&nbsp;&nbsp;Deposit</p>
      </div>
      <div
        className={`flex justify-center  rounded-lg py-10 px-15 ${
          !active ? "bg-bunker text-primary" : "bg-woodsmoke text-second"
        } hover:bg-bunker hover:text-primary`}
        onClick={handleWithdraw}
      >
        <SvgIcon component={RemoveRounded} />
        <p className="ml-5">&nbsp;Withdraw</p>
      </div>
    </div>
  );

  return (
    <div className="text-primary md:rounded-3xl border-bunker border-2">
      <div className="flex xs:flex-col sm:flex-row sm:justify-between xs:items-start sm:items-center border-b-2 border-bunker xs:px-10 xl:px-40 py-30">
        <div className="flex items-center">
          <div className="text-success rounded-full bg-[#0E1214] p-10">
            <SvgIcon component={NorthEastRounded} />
          </div>
          <p className="ml-10 text-30">Earn Pool</p>
        </div>
        <div className="xs:hidden sm:block">
          <PoolAction />
        </div>
      </div>
      <div className="xs:px-10 xl:px-40 py-30">
        <div className="xs:flex sm:hidden justify-center ">
          <PoolAction />
        </div>
        <div className="w-full flex flex-col justify-center items-center bg-bunker rounded-2xl xs:py-10 sm:py-20 my-15">
          <p className="text-second text-16">Total value locked</p>
          <p className="text-primary text-30">$54,521.00</p>
        </div>
        <div className="w-full grid grid-cols-3 grid-rows-1 sm:gap-20 my-15">
          <div className="xs:rounded-l-2xl sm:rounded-2xl bg-bunker flex flex-col justify-center items-center py-15">
            <p className="text-second text-16">Pool APR</p>
            <p className="text-primary text-18">30.00%</p>
          </div>
          <div className="sm:rounded-2xl bg-bunker flex flex-col justify-center items-center">
            <p className="text-second text-16">Lock duration</p>
            <p className="text-primary text-18">24 hours</p>
          </div>
          <div className="xs:rounded-r-2xl sm:rounded-2xl bg-bunker flex flex-col justify-center items-center">
            <p className="text-second text-16">Currencies</p>
            <p className="text-primary text-18">$54,521.00</p>
          </div>
        </div>
        <div className="grid xs:grid-cols-1 lg:grid-cols-2 xs:gap-30 lg:gap-40 text-14">
          <div className="grid grid-row-2 gap-30">
            <div className="overview">
              <LabelIcon label="Overview" labelFontSize={20} icon={ErrorOutlineRounded} />
              <p className="mt-15 text-regentgray">
                Deposit DAI to earn from this vault. Funds are locked for 24 hours.
              </p>
            </div>
            <div className="duration">
              <LabelIcon label="Duration" labelFontSize={20} icon={ErrorOutlineRounded} />
              <div className="mt-20">
                <LinearProgressWithLabel value={70} />
              </div>
            </div>
          </div>
          <div className="position">
            <div className="w-full flex justify-between items-center">
              <LabelIcon
                label="Position"
                icon={ErrorOutlineRounded}
                labelColor="primary"
                labelFontSize={20}
              />
              <p className="text-success">$0.00</p>
            </div>
            <div className="w-full flex justify-between items-center">
              <div>
                <p className="text-second text-18 my-15">Asset</p>
                <LabelIcon
                  label="DAI"
                  icon={() => <img src={DAIImage} alt="DAI LOGO" />}
                  reverse
                />
              </div>
              <div className="flex flex-col items-end justify-center">
                <p className="text-second text-18 my-15">My position</p>
                <p className="text-second text-16">0.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
