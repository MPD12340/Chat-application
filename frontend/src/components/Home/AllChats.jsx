import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChats } from "../../redux/appReducer/action";
import CreateGroupChat from "./AllChats/CreateGroupChat";
import DisplayChatCard from "./AllChats/DisplayChatCard";

export default function AllChats() {
  const dispatch = useDispatch();
  const allChat = useSelector((state) => state.appReducer.allChat);
  const createGroupChatSuccess = useSelector(
    (state) => state.appReducer.createGroupChatSuccess
  );
  const singleUserChatsuccess = useSelector(
    (state) => state.appReducer.singleUserChatsuccess
  );
  const addMembersInGroupSuccess = useSelector(
    (state) => state.appReducer.addMembersInGroupSuccess
  );
  const isRenameGroupSuccess = useSelector(
    (state) => state.appReducer.isRenameGroupSuccess
  );
  const removeMembersFromGroupSuccess = useSelector(
    (state) => state.appReducer.removeMembersFromGroupSuccess
  );

  useEffect(() => {
    dispatch(getChats());
  }, [
    createGroupChatSuccess,
    singleUserChatsuccess,
    addMembersInGroupSuccess,
    removeMembersFromGroupSuccess,
    isRenameGroupSuccess,
    dispatch,
  ]);

  return (
    <div className="flex flex-col flex-grow p-4">
      <CreateGroupChat />

      <div className="bg-white mt-4 rounded-md border border-gray-200 shadow-sm">
        <div className="max-h-[72vh] p-4 overflow-y-auto">
          {allChat?.map((item) => (
            <DisplayChatCard item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
