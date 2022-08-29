import { DaiToken } from "@fantohm/shared/images";
import { Box } from "@mui/material";

export type PositionTemplateProps = {
  symbol: string;
};

export const PositionTemplate = (props: PositionTemplateProps) => {
  return (
    <Box className="flex fr fj-sb ai-c">
      <Box className="flex fr ai-c">
        <img
          src={DaiToken}
          style={{ height: "1.2em", width: "1.2em", marginRight: "0.5em" }}
        />
        DAI
      </Box>
      <span>$0.00</span>
    </Box>
  );
};
