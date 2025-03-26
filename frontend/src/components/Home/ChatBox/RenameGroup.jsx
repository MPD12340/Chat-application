import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeGroupName, getChats } from "../../../redux/appReducer/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function RenameGroup() {
  const selectedUserForChat = useSelector(
    (state) => state.appReducer.selectedUserForChat
  );
  const isRenameGroupFail = useSelector(
    (state) => state.appReducer.isRenameGroupFail
  );
  const isRenameGroupSuccess = useSelector(
    (state) => state.appReducer.isRenameGroupSuccess
  );
  const isRenameGroupProcessing = useSelector(
    (state) => state.appReducer.isRenameGroupProcessing
  );
  const [groupName, setGroupName] = useState("");
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) setGroupName("");
  };

  const handleChangeButtonClick = () => {
    if (groupName.trim().length === 0) {
      toast.error("Enter valid name.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    }

    if (groupName.trim().length > 30) {
      toast.error("Name length not more than 30 characters.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    }

    dispatch(
      changeGroupName({
        chatId: selectedUserForChat._id,
        chatName: groupName.trim(),
      })
    );
  };

  useEffect(() => {
    if (!isRenameGroupProcessing && groupName) {
      if (!isRenameGroupFail && isRenameGroupSuccess) {
        toast.success("Group successfully renamed.", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        dispatch(getChats());
        setGroupName("");
        toggleModal();
      } else if (isRenameGroupFail && !isRenameGroupSuccess) {
        toast.error("Failed to rename group.", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        setGroupName("");
      }
    }
  }, [isRenameGroupFail, isRenameGroupSuccess, isRenameGroupProcessing]);

  return (
    <div>
      <button
        className="w-full py-2 px-4 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-md transition-colors"
        onClick={toggleModal}
      >
        Change Name
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Change Group Name
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 rounded-full p-1"
                onClick={toggleModal}
              >
                <AiOutlineCloseCircle size={24} />
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Group Name
              </label>
              <input
                id="groupName"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={groupName}
                placeholder={selectedUserForChat.chatName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={30}
              />
              <p className="mt-1 text-xs text-gray-500">Max 30 characters</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={toggleModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isRenameGroupProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleChangeButtonClick}
                disabled={isRenameGroupProcessing}
              >
                {isRenameGroupProcessing ? (
                  <div className="flex items-center justify-center">
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
                    Renaming...
                  </div>
                ) : (
                  "Rename Group"
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
