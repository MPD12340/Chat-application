import React from "react";
import ChatDetails from "./ChatDetails";
import { useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import UpdateGroup from "./UpdateGroup";

export default function ChatHeader() {
  const selectedUserForChat = useSelector(
    (state) => state.appReducer.selectedUserForChat
  );
  const loginUser = JSON.parse(
    localStorage.getItem("chat-app-login-user-data")
  );

  // Find the user from selectedUserForChat that doesn't match the _id in localStorageData
  const selectedUser = selectedUserForChat.users.find(
    (user) => user._id !== loginUser._id
  );

  return (
    <div className="flex justify-between items-center h-14 bg-white border-b border-gray-200 shadow-sm rounded-t-md px-4">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={
              selectedUserForChat.isGroupChat
                ? "https://cdn-icons-png.flaticon.com/512/2043/2043173.png"
                : selectedUser.pic
            }
            alt={
              selectedUserForChat.isGroupChat ? "Group Icon" : selectedUser.name
            }
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 truncate">
          {selectedUserForChat.isGroupChat
            ? selectedUserForChat.chatName
            : selectedUser.name}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {selectedUserForChat.isGroupChat && <ChatDetails />}
        {selectedUserForChat.isGroupChat &&
          selectedUserForChat.groupAdmin === loginUser._id && <UpdateGroup />}
      </div>
    </div>
  );
}
