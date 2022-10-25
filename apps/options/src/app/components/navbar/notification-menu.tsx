import { Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import { useState } from "react";

const NotificationMenu = () => {
  const [isInvisible, setInvisible] = useState(false);
  return (
    <div className="p-10 bg-woodsmoke rounded-lg xs:hidden sm:block">
      <Badge color="success" badgeContent="" variant="dot" invisible={isInvisible}>
        <NotificationsIcon />
      </Badge>
    </div>
  );
};

export default NotificationMenu;
