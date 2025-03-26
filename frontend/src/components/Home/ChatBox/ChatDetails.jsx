import React, { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

export default function ChatDetails() {
  const selectedUserForChat = useSelector(
    (state) => state.appReducer.selectedUserForChat
  );
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const groupAdmin = () => {
    const admin = selectedUserForChat.users.find(
      (user) => user._id === selectedUserForChat.groupAdmin
    );
    return admin.name;
  };

  return (
    <section>
      <button
        className="text-indigo-600 p-2 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        onClick={toggleModal}
      >
        <BsInfoCircle size={24} />
      </button>

      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-md shadow-md border border-gray-200 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedUserForChat.chatName}
              </h2>
              <button
                className="text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full p-1"
                onClick={toggleModal}
              >
                <AiOutlineCloseCircle size={24} />
              </button>
            </div>

            {/* Group info */}
            <p className="text-sm font-medium text-gray-900">
              Group Admin:{" "}
              <span className="font-normal text-gray-600">{groupAdmin()}</span>
            </p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              Total Members:{" "}
              <span className="font-normal text-gray-600">
                {selectedUserForChat.users.length}
              </span>
            </p>

            {/* Group members */}
            <div className="max-h-[50vh] overflow-y-auto mt-4">
              {selectedUserForChat.users?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-md shadow-sm flex items-center space-x-4 p-3 mt-3 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={item.pic}
                      alt={`${item.name} image`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {item.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
