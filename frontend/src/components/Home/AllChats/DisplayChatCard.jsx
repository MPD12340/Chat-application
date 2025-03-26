import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMessage,
  selectUserForChat,
} from "../../../redux/appReducer/action";

const DisplayChatCard = ({ item }) => {
  const webSocket = useSelector((state) => state.appReducer.webSocket);
  const parsedData = JSON.parse(
    localStorage.getItem("chat-app-login-user-data")
  );
  const selectedUserForChat = useSelector(
    (state) => state.appReducer.selectedUserForChat
  );
  const dispatch = useDispatch();

  // Check if this chat is currently selected
  const isActive = selectedUserForChat?._id === item._id;

  // Select User For Chat
  const handelSelectUserForChat = () => {
    dispatch(selectUserForChat(item));
    dispatch(getMessage(item._id));
    webSocket.emit("join chat", item._id);
  };

  // Find the user from item that doesn't match the _id in parsedData
  const selectedUser = item.users.find((user) => user._id !== parsedData._id);

  return (
    <div
      onClick={handelSelectUserForChat}
      className={`cursor-pointer rounded-lg mt-2 transition-colors duration-200 ${
        isActive
          ? "bg-indigo-100 ring-2 ring-indigo-300"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-3 p-3">
        <div className="flex-shrink-0">
          <img
            className="w-10 h-10 rounded-full border border-gray-200"
            src={
              item.isGroupChat
                ? "https://cdn-icons-png.flaticon.com/512/2043/2043173.png"
                : selectedUser.pic
            }
            alt={item.isGroupChat ? item.chatName : selectedUser.name}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.isGroupChat ? item.chatName : selectedUser.name}
            </p>
            {item.latestMessage && (
              <span className="text-xs text-gray-500">
                {new Date(item.latestMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate mt-1">
            {item.latestMessage?.message
              ? item.latestMessage.message.length > 30
                ? `${item.latestMessage.message.substring(0, 30)}...`
                : item.latestMessage.message
              : "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayChatCard;
