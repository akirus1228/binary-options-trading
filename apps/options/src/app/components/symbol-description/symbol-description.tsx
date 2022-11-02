import { SvgIcon } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";

export const SymbolDescription = (props: {
  underlyingToken: string;
  basicToken: string;
  dateRage: string;
}) => {
  return (
    <div className="bg-[#0B1314] text-second xs:px-10 sm:px-15 py-5 rounded-xl flex items-center border-2 border-second xs:text-12 sm:text-16">
      <p>
        {props.underlyingToken}&nbsp;&#8725;&nbsp;{props.basicToken}&nbsp;&#8226;&nbsp;
        {props.dateRage}&nbsp;&#8226;&nbsp;TradingView
      </p>
      <SvgIcon component={FiberManualRecord} className="xs:text-16 sm:text-20 ml-10" />
    </div>
  );
};
