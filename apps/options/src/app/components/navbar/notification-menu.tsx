import { Badge, Button, Popover, SvgIcon } from "@mui/material";
import { NotificationsNone } from "@mui/icons-material";
import { useEffect, useState } from "react";

const notifications = [
  {
    type: "price",
    description: "ETH/DAI is up +5.00% over the past 24 hours",
  },
  {
    type: "price",
    description: "ETH/DAI is above 15100",
  },
  {
    type: "price",
    description: "ETH/DAI is up -5.00% over currently",
  },
  {
    type: "price",
    description: "ETH/DAI is up +5.00% over the past 24 hours",
  },
  {
    type: "price",
    description: "ETH/DAI is above 15100",
  },
  {
    type: "price",
    description: "ETH/DAI is up -5.00% over currently",
  },
];

const NotificationMenu = () => {
  const [isInvisible, setInvisible] = useState(false);
  const [flagAccountDropDown, setFlagAccountDropDown] = useState<null | HTMLElement>(
    null
  );

  useEffect(() => {
    if (notifications.length > 0) setInvisible(false);
    else setInvisible(true);
  }, [notifications]);

  const accountDrop = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagAccountDropDown(event.currentTarget);
  };

  const handleSetting = () => {
    console.log("Click setting;");
  };

  return (
    <div>
      <Button
        className="bg-woodsmoke rounded-2xl xs:hidden sm:block mr-10"
        onClick={accountDrop}
        sx={{ p: "10px", minWidth: "30px" }}
      >
        <Badge
          badgeContent=""
          variant="dot"
          invisible={isInvisible}
          sx={{ "& .MuiBadge-dot": { backgroundColor: "#12b3a8" } }}
        >
          <NotificationsNone className="text-primary" />
        </Badge>
      </Button>
      <Popover
        id={"Account"}
        open={Boolean(flagAccountDropDown)}
        anchorEl={flagAccountDropDown}
        onClose={() => setFlagAccountDropDown(null)}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="accountDropdown mt-20"
        sx={{
          "& .MuiPopover-paper": { backgroundColor: "#0B0F10", borderRadius: "25px" },
        }}
      >
        <div className="pt-20 bg-woodsmoke text-primary xs:w-250 sm:w-420 cursor-default">
          <div className="flex justify-between items-center px-20">
            <h3 className="text-primary ">Notifications</h3>
            <button
              className="text-primary bg-[#0f1617] px-10 py-5 rounded-2xl"
              onClick={handleSetting}
            >
              Settings
            </button>
          </div>
          <div className="notifications p-20 max-h-180 overflow-y-auto scrollbar-hide">
            {notifications.map((item, index) => (
              <div className="notification flex items-center mb-10" key={index}>
                <SvgIcon
                  component={NotificationsNone}
                  className="text-35 text-primary rounded-full p-5 bg-[#0f1617] mr-10"
                />
                <div className="grow text-primary">
                  <p className="xs:text-14">
                    {item.type[0].toUpperCase() + item.type.slice(1).toLowerCase()}
                    &nbsp;Alert
                  </p>
                  <p className="xs:text-16">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default NotificationMenu;
