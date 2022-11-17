import { Avatar, Box, SvgIcon } from "@mui/material";
import {
  MarkUnreadChatAltOutlined,
  FiberManualRecordRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import { useWeb3Context } from "@fantohm/shared-web3";
import { addressEllipsis } from "@fantohm/shared-helpers";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { ChatInterface } from "../../core/interfaces/basic.interface";
import { convertTime } from "../../helpers/data-translations";
import { socketURL } from "../../core/constants/chat";
import AvatarPlaceholder from "../../../assets/images/temp-avatar.png";
import { RootState } from "../../store";
import { addMessage, loadMessages } from "../../store/reducers/chat-slice";

const socket = io(socketURL);

const Chat = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  console.log("messages", messages);
  const { address } = useWeb3Context();
  console.log(address);
  const [message, setMessage] = useState<string>();
  const [available, setAvailable] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const handleSendMessage = () => {
    if (message && message !== "") {
      console.log("message: ", message);
      const chat = {
        user: address,
        text: message,
      };
      socket.emit("chat", chat);
    }
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("users", (result) => {
      setOnlineUsers(result);
    });

    socket.on("newChat", (result) => {
      dispatch(addMessage(result));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newChat");
    };
  }, [isConnected]);

  useEffect(() => {
    dispatch(loadMessages());
  }, []);

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
        } w-full bg-woodsmoke rounded-b-3xl`}
      >
        <div className="max-h-500 overflow-y-scroll scrollbar-hide">
          {messages.map((message: ChatInterface, index: number) => (
            <div
              className="min-h-85 flex items-start xs:px-10 sm:px-25 py-10"
              key={index}
            >
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
                  <p className="text-success mr-10">{addressEllipsis(message.user)}</p>
                  <p className="text-second">
                    {convertTime(new Date(message.createdAt)).time}
                  </p>
                </div>
                <div className="text-primary">
                  <p className="text-17">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something…"
            className="text-primary p-0 mx-5 outline-none border-0 grow bg-woodsmoke"
          />
          <button onClick={handleSendMessage}>
            <SvgIcon
              component={ArrowForwardRounded}
              className="rounded-full text-25 text-success bg-light-woodsmoke"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
