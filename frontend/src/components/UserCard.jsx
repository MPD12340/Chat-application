import React from "react";
import { useDispatch } from "react-redux";
import { createSingleUserChat } from "../redux/appReducer/action";

const UserCard = ({ name, email, imageSrc, userId }) => {
  const dispatch = useDispatch();

  const handelCreateChat = () => {
    dispatch(createSingleUserChat(userId));
  };

  return (
    <div
      onClick={handelCreateChat}
      className="bg-white cursor-pointer rounded-md border border-gray-200 shadow-sm mt-3 hover:shadow-md hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
    >
      <div className="flex items-center space-x-4 p-3">
        <div className="flex-shrink-0">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={imageSrc}
            alt={`${name} image`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-600 truncate">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
