import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, searchUsers } from "../../../redux/appReducer/action";
import AddUser from "../../CommonComponents/AddUser";
import Badge from "../../CommonComponents/Badge";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomInput from "../../CommonComponents/CustomInput";
import { AiOutlinePlus } from "react-icons/ai";

export default function CreateGroupChat() {
  const [isModalVisible, setModalVisibility] = useState(false);
  const [userInput, setUserInput] = useState({
    groupName: "",
    searchUser: "",
    addUsers: [],
  });
  const searchedUser = useSelector((state) => state.appReducer.searchedUser);
  const isSearchUserProcessing = useSelector(
    (state) => state.appReducer.isSearchUserProcessing
  );
  const createGroupChatSuccess = useSelector(
    (state) => state.appReducer.createGroupChatSuccess
  );
  const createGroupChatFail = useSelector(
    (state) => state.appReducer.createGroupChatFail
  );
  const createGroupChatProcessing = useSelector(
    (state) => state.appReducer.createGroupChatProcessing
  );
  const dispatch = useDispatch();

  const toggleModal = () => {
    setModalVisibility(!isModalVisible);
    if (!isModalVisible) {
      setUserInput({ groupName: "", searchUser: "", addUsers: [] });
    }
  };

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

  const handelCreateGroup = () => {
    if (userInput.groupName.length <= 0) {
      toast.warn("Please give a group name.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    }

    if (userInput.addUsers.length < 2) {
      toast.warn("Add a minimum of two users to create a group.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    }

    const obj = {
      name: userInput.groupName,
      users: JSON.stringify(userInput.addUsers.map((user) => user.userId)),
    };

    dispatch(createGroup(obj));
  };

  useEffect(() => {
    if (createGroupChatSuccess && !createGroupChatProcessing) {
      toast.success("Group successfully created.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      setUserInput({ groupName: "", searchUser: "", addUsers: [] });
      setTimeout(() => {
        toggleModal();
      }, 1000);
    }

    if (createGroupChatFail && !createGroupChatProcessing) {
      toast.error("Failed to create group.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, [createGroupChatSuccess, createGroupChatProcessing, createGroupChatFail]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (userInput.searchUser.trim().length > 0) {
        dispatch(searchUsers(userInput.searchUser.trim()));
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [userInput.searchUser, dispatch]);

  return (
    <div>
      <button
        onClick={toggleModal}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <AiOutlinePlus size={18} />
        Create Group
      </button>

      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Create New Group
              </h3>
            </div>

            <div className="space-y-4">
              {/* Group Name Input */}
              <div>
                <label
                  htmlFor="groupName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Group Name
                </label>
                <CustomInput
                  id="groupName"
                  name="groupName"
                  value={userInput.groupName}
                  onChange={handleInputChange}
                  placeholder="Enter group name"
                  className="mt-1"
                />
              </div>

              {/* Add User Input */}
              <div>
                <label
                  htmlFor="searchUser"
                  className="block text-sm font-medium text-gray-700"
                >
                  Add Users
                </label>
                <CustomInput
                  id="searchUser"
                  name="searchUser"
                  value={userInput.searchUser}
                  onChange={handleInputChange}
                  placeholder="Search users to add"
                  className="mt-1"
                />
              </div>

              {/* Selected Users Badges */}
              <div className="flex flex-wrap gap-2">
                {userInput.addUsers?.map((item) => (
                  <Badge
                    label={item.name}
                    userId={item.userId}
                    removeUser={removeUser}
                    key={item.userId}
                    variant="indigo"
                  />
                ))}
              </div>

              {/* Search Results */}
              <div className="max-h-[200px] overflow-y-auto border border-gray-200 rounded-md">
                {isSearchUserProcessing ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : searchedUser.length === 0 ? (
                  <p className="p-3 text-sm text-center text-gray-500">
                    No users found
                  </p>
                ) : (
                  searchedUser.map((item) => (
                    <AddUser
                      key={item._id}
                      addUser={addUser}
                      userId={item._id}
                      name={item.name}
                      email={item.email}
                      imageSrc={item.pic}
                    />
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handelCreateGroup}
                  disabled={createGroupChatProcessing}
                  className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    createGroupChatProcessing
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {createGroupChatProcessing ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-2 -ml-1 animate-spin"
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
                      Creating...
                    </div>
                  ) : (
                    "Create Group"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
