import { Avatar, Box, Button, Icon, Popover, IconButton, SvgIcon } from "@mui/material";
import {
  MarkUnreadChatAltOutlined,
  FiberManualRecordRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import { useState } from "react";

import AvatarPlaceholder from "../../../assets/images/temp-avatar.png";

const Chat = () => {
  const [available, setAvailable] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState(420);

  return (
    <div className="chat w-full max-w-500">
      <div
        className={`chat-header xs:px-10 sm:px-25 xs:py-10 sm:py-15 ${
          available ? "rounded-3xl" : "rounded-t-3xl"
        } bg-woodsmoke text-primary flex justify-between items-center`}
        onClick={() => setAvailable(!available)}
      >
        <div className="chat-title flex items-center">
          <SvgIcon
            component={MarkUnreadChatAltOutlined}
            className="p-10 rounded-full text-primary bg-light-woodsmoke text-36"
          />
          <p className="xs:ml-5 sm:ml-15 xs:text-20 sm:text-24 text-primary">Chat</p>
        </div>
        <div className="online-users flex items-center rounded-3xl bg-lightgreen px-10">
          <SvgIcon
            component={FiberManualRecordRounded}
            className="rounded-full xs:text-16 sm:text-20 text-success"
          />
          <p className="ml-5 text-18 text-success">
            {onlineUsers}&nbsp;users&nbsp;online
          </p>
        </div>
      </div>
      <div
        className={`chat-body ${
          available ? "hidden" : "block"
        } w-full max-h-96 bg-woodsmoke rounded-b-3xl`}
      >
        <div className="min-h-85 flex items-start xs:px-10 sm:px-25 py-10">
          <Box sx={{ display: "block", marginRight: "5px" }} className={""}>
            <Avatar
              sx={{
                mr: { sm: "0", md: "1em" },
                borderRadius: "2rem",
                bgcolor: "#161B1D",
                width: "38px",
                height: "38px",
                padding: "8px",
              }}
              src={AvatarPlaceholder}
              className="xs:block "
            />
          </Box>
          <div className="grid grid-rows-2">
            <div className="flex items-center pb-5 text-15">
              <p className="text-success mr-10">Name</p>
              <p className="text-second">06:45&nbsp;PM</p>
            </div>
            <div className="text-primary">
              <p className="text-17">Hello, guys</p>
            </div>
          </div>
        </div>
        <div className="min-h-60 xs:px-10 sm:px-25 border-t border-t-second flex items-center">
          <Box sx={{ display: "block" }} className={""}>
            <Avatar
              sx={{
                mr: { sm: "0", md: "1em" },
                borderRadius: "2rem",
                bgcolor: "#161B1D",
                width: "35px",
                height: "35px",
                padding: "8px",
              }}
              src={AvatarPlaceholder}
              className="xs:block "
            />
          </Box>
          <input
            type="text"
            placeholder="Write something…"
            className="text-primary p-0 mx-5 outline-none border-0 grow bg-woodsmoke"
          />
          <div>
            <SvgIcon
              component={ArrowForwardRounded}
              className="rounded-full text-25 text-success bg-light-woodsmoke"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
