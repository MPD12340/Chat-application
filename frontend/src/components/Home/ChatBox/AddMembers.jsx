import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMembersInGroup,
  searchUsers,
} from "../../../redux/appReducer/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import CustomInput from "../../CommonComponents/CustomInput";
import AddUser from "../../CommonComponents/AddUser";
import Badge from "../../CommonComponents/Badge";

export default function AddMembers() {
  const [showModal, setShowModal] = useState(false);
  const [userInput, setUserInput] = useState({ searchUser: "", addUsers: [] });
  const searchedUser = useSelector((state) => state.appReducer.searchedUser);
  const isSearchUserProcessing = useSelector(
    (state) => state.appReducer.isSearchUserProcessing
  );
  const addMembersInGroupProcessing = useSelector(
    (state) => state.appReducer.addMembersInGroupProcessing
  );
  const addMembersInGroupSuccess = useSelector(
    (state) => state.appReducer.addMembersInGroupSuccess
  );
  const addMembersInGroupFail = useSelector(
    (state) => state.appReducer.addMembersInGroupFail
  );
  const selectedUserForChat = useSelector(
    (state) => state.appReducer.selectedUserForChat
  );
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addUser = (userId, name) => {
    if (!userInput.addUsers.some((user) => user.userId === userId)) {
      setUserInput((prevState) => ({
        ...prevState,
        addUsers: [...prevState.addUsers, { userId, name }],
      }));
    }
  };

  const removeUser = (userId) => {
    setUserInput((prevState) => ({
      ...prevState,
      addUsers: prevState.addUsers.filter((user) => user.userId !== userId),
    }));
  };

  const groupAdmin = () => {
    const admin = selectedUserForChat.users.find(
      (user) => user._id === selectedUserForChat.groupAdmin
    );
    return admin.name;
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handelAddMemberRequest = () => {
    if (userInput.addUsers.length < 1) {
      toast.warn("Select at least one user.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    }

    const obj = {
      chatId: selectedUserForChat._id,
      userId: userInput.addUsers.map((user) => user.userId),
    };

    dispatch(addMembersInGroup(obj));
  };

  useEffect(() => {
    if (
      addMembersInGroupSuccess &&
      !addMembersInGroupProcessing &&
      userInput.addUsers.length >= 1
    ) {
      toast.success("Members successfully added to group.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      setUserInput({ searchUser: "", addUsers: [] });
      setTimeout(() => {
        toggleModal();
      }, 1000);
    }

    if (
      addMembersInGroupFail &&
      !addMembersInGroupProcessing &&
      userInput.addUsers.length >= 1
    ) {
      setUserInput({ searchUser: "", addUsers: [] });
      toast.error("Failed to add members in group.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, [
    addMembersInGroupSuccess,
    addMembersInGroupProcessing,
    addMembersInGroupFail,
  ]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (userInput.searchUser.trim()) {
        dispatch(searchUsers(userInput.searchUser.trim()));
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [userInput.searchUser, dispatch]);

  return (
    <section>
      <button
        className="w-full py-2 px-4 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={toggleModal}
      >
        Add Members
      </button>

      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-md shadow-md border border-gray-200 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Add Members to Group
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
            <p className="text-sm font-medium text-gray-900 mt-1 mb-4">
              Total Members:{" "}
              <span className="font-normal text-gray-600">
                {selectedUserForChat.users.length}
              </span>
            </p>

            {/* Search input */}
            <CustomInput
              label="Add User"
              value={userInput.searchUser}
              onChange={handleInputChange}
              name="searchUser"
              placeholder="Enter User"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            {/* Selected users badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {userInput.addUsers?.map((item) => (
                <Badge
                  label={item.name}
                  userId={item.userId}
                  removeUser={removeUser}
                  key={item.userId}
                />
              ))}
            </div>

            {/* Loading status */}
            {isSearchUserProcessing && (
              <div className="flex items-center justify-center mt-6">
                <svg
                  className="animate-spin h-8 w-8 text-indigo-600"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}

            {/* No users found */}
            {!isSearchUserProcessing &&
              searchedUser.length === 0 &&
              userInput.searchUser && (
                <p className="text-gray-600 text-center mt-4">No User Found.</p>
              )}

            {/* Searched users list */}
            <div className="max-h-[30vh] overflow-y-auto mt-4">
              {searchedUser.length !== 0 &&
                searchedUser.map((item) => (
                  <AddUser
                    addUser={addUser}
                    userId={item._id}
                    name={item.name}
                    email={item.email}
                    imageSrc={item.pic}
                    key={item._id}
                  />
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end mt-6">
              <button
                onClick={toggleModal}
                type="button"
                disabled={addMembersInGroupProcessing}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handelAddMemberRequest}
                type="button"
                disabled={addMembersInGroupProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {addMembersInGroupProcessing ? (
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Adding...
                  </div>
                ) : (
                  "Add Members"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </section>
  );
}
