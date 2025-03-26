import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeGroupName,
  getChats,
  removeMembersFromGroup,
} from "../../../redux/appReducer/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Badge from "../../CommonComponents/Badge";

export default function RemoveMembers() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const selectedUserForChat = useSelector(
    (state) => state.appReducer.selectedUserForChat
  );
  const removeMembersFromGroupFail = useSelector(
    (state) => state.appReducer.removeMembersFromGroupFail
  );
  const removeMembersFromGroupSuccess = useSelector(
    (state) => state.appReducer.removeMembersFromGroupSuccess
  );
  const removeMembersFromGroupProcessing = useSelector(
    (state) => state.appReducer.removeMembersFromGroupProcessing
  );
  const [groupMembers, setGroupMembers] = useState(selectedUserForChat.users);
  const [removeMembers, setRemoveMembers] = useState([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const removeUser = (userId) => {
    setGroupMembers((prevState) => {
      const filteredMembers = prevState.filter((user) => user._id !== userId);
      const removedUser = prevState.find((user) => user._id === userId);
      if (removedUser) {
        setRemoveMembers((prevRemoveMembers) => [
          ...prevRemoveMembers,
          removedUser,
        ]);
      }
      return filteredMembers;
    });
  };

  const addUser = (userId) => {
    setRemoveMembers((prevRemoveMembers) => {
      const filteredMembers = prevRemoveMembers.filter(
        (user) => user._id !== userId
      );
      const addedUser = prevRemoveMembers.find((user) => user._id === userId);
      if (addedUser) {
        setGroupMembers((prevGroupMembers) => [...prevGroupMembers, addedUser]);
      }
      return filteredMembers;
    });
  };

  const groupAdmin = () => {
    const admin = selectedUserForChat.users.find(
      (user) => user._id === selectedUserForChat.groupAdmin
    );
    return admin.name;
  };

  const handelRemoveMembers = () => {
    const obj = {
      chatId: selectedUserForChat._id,
      userId: removeMembers,
    };
    dispatch(removeMembersFromGroup(obj));
  };

  useEffect(() => {
    if (
      removeMembersFromGroupSuccess &&
      !removeMembersFromGroupFail &&
      removeMembers.length >= 1
    ) {
      toast.success("Members successfully removed from group.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });

      setRemoveMembers([]);
      setGroupMembers([]);

      setTimeout(() => {
        toggleModal();
      }, 1000);
    }

    if (
      removeMembersFromGroupFail &&
      !removeMembersFromGroupProcessing &&
      removeMembers.length >= 1
    ) {
      setRemoveMembers([]);
      setGroupMembers([]);
      toast.error("Failed to remove members from group.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, [
    removeMembersFromGroupProcessing,
    removeMembersFromGroupFail,
    removeMembersFromGroupSuccess,
  ]);

  return (
    <div>
      <button
        className="w-full py-2 px-4 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-md transition-colors"
        onClick={toggleModal}
      >
        Remove members
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Remove Members
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 rounded-full p-1"
                onClick={toggleModal}
              >
                <AiOutlineCloseCircle size={24} />
              </button>
            </div>

            {/* Group Info */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700">
                Group Admin:
                <span className="font-normal ml-1 text-gray-600">
                  {groupAdmin()}
                </span>
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">
                Total Members:
                <span className="font-normal ml-1 text-gray-600">
                  {selectedUserForChat.users.length}
                </span>
              </p>
            </div>

            {/* Group Members */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Group Members
              </h3>
              <div className="flex flex-wrap gap-2">
                {groupMembers?.map((item) => {
                  if (item._id !== item.groupAdmin) {
                    return (
                      <Badge
                        label={item.name}
                        userId={item._id}
                        removeUser={removeUser}
                        key={item._id}
                        variant="indigo"
                      />
                    );
                  }
                })}
              </div>
            </div>

            {/* Removing Members */}
            {removeMembers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Members to Remove
                </h3>
                <div className="flex flex-wrap gap-2">
                  {removeMembers?.map((item) => {
                    if (item._id !== item.groupAdmin) {
                      return (
                        <Badge
                          label={item.name}
                          userId={item._id}
                          removeUser={addUser}
                          key={item._id}
                          variant="red"
                        />
                      );
                    }
                  })}
                </div>
              </div>
            )}

            {/* Remove Button */}
            <div className="flex justify-end mt-4">
              <button
                className={`px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  removeMembersFromGroupProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handelRemoveMembers}
                disabled={
                  removeMembersFromGroupProcessing || removeMembers.length === 0
                }
              >
                {removeMembersFromGroupProcessing ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Removing...
                  </div>
                ) : (
                  "Remove Members"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
