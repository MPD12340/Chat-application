import React, { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RenameGroup from "./RenameGroup";
import RemoveMembers from "./RemoveMembers";
import AddMembers from "./AddMembers";

export default function UpdateGroup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);

  const handleProfileClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      {/* Dropdown toggle button */}
      <button
        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        onClick={handleProfileClick}
        aria-expanded={isPopupOpen}
        aria-haspopup="true"
      >
        <BsThreeDotsVertical size={20} />
      </button>

      {/* Dropdown menu */}
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
        >
          <div className="py-1" role="none">
            {/* Rename group option */}
            <div className="px-4 py-2 hover:bg-gray-100">
              <RenameGroup />
            </div>

            {/* Add members option */}
            <div className="px-4 py-2 hover:bg-gray-100">
              <AddMembers />
            </div>

            {/* Remove members option */}
            <div className="px-4 py-2 hover:bg-gray-100">
              <RemoveMembers />
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
