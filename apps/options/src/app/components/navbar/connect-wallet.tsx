import Badge from "@mui/material/Badge";
import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";

const ConnectWallet = () => {
  const [isConnected, setConnected] = useState(false);
  const [isInvisible, setInvisible] = useState(false);
  const [ETHAmount, setETHAmount] = useState<number>(0.0);

  const handleClick = () => {
    setConnected(!isConnected);
  };

  return (
    <div
      className={`xs:150 sm:w-320 flex items-center p-5 ml-5
        ${
          isConnected ? "justify-between border border-second rounded-2xl" : "justify-end"
        } 
      `}
    >
      {isConnected ? (
        <div className="w-full flex justify-between items-center">
          <div className="xs:hidden sm:block">
            <code className="xs:text-12 sm:text-20">{ETHAmount.toFixed(6)} ETH</code>
          </div>
          <div className="p-10 bg-woodsmoke rounded-lg">
            <Badge color="success" badgeContent="" variant="dot" invisible={isInvisible}>
              <NotificationsIcon />
            </Badge>
          </div>
          <button
            className="rounded-2xl bg-danger xs:text-12 sm:text-20 text-primary p-10 font-bold"
            onClick={() => {
              handleClick();
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          className="rounded-2xl bg-success text-16 text-primary p-10 font-bold"
          onClick={() => {
            handleClick();
          }}
        >
          ConnectWallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
