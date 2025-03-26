import React, { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import UserCard from "./UserCard";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../redux/appReducer/action";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const searchedUser = useSelector((state) => state.appReducer.searchedUser);
  const isSearchUserProcessing = useSelector(
    (state) => state.appReducer.isSearchUserProcessing
  );
  const singleUserChatsuccess = useSelector(
    (state) => state.appReducer.singleUserChatsuccess
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (singleUserChatsuccess) {
      setIsOpen(false);
    }
  }, [singleUserChatsuccess]);

  const handleOpenSidebar = () => {
    setIsOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  const handelSearchUser = () => {
    dispatch(searchUsers(userInput.trim()));
  };

  return (
    <>
      {/* Search button */}
      <button
        className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        onClick={handleOpenSidebar}
      >
        <BiSearchAlt className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-white w-80 fixed top-0 ${
          isOpen ? "left-0" : "-left-80"
        } h-screen transform transition-transform duration-300 ease-in-out z-40 shadow-md border-r border-gray-200`}
      >
        {/* Close button */}
        <div className="p-4 flex justify-end">
          <button
            className="text-gray-600 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            onClick={handleCloseSidebar}
          >
            <AiOutlineCloseCircle className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col flex-grow px-4 pb-4">
          {/* Search field */}
          <div className="relative">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Search User"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
              onClick={handelSearchUser}
            >
              <BiSearchAlt className="w-5 h-5" />
            </button>
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
          {!isSearchUserProcessing && searchedUser.length === 0 && (
            <p className="text-gray-600 text-center mt-6">No User Found.</p>
          )}

          {/* Searched users list */}
          <div className="mt-6 max-h-[75vh] overflow-y-auto">
            {searchedUser.length !== 0 &&
              searchedUser.map((item) => (
                <UserCard
                  key={item._id}
                  userId={item._id}
                  name={item.name}
                  email={item.email}
                  imageSrc={item.pic}
                />
              ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
