import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAccount, updateUserData } from "../redux/authReducer/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadImage from "./CommonComponents/UploadImage";

export default function UserProfile() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dispatch = useDispatch();
  const popupRef = useRef(null);
  const user_update_success = useSelector(
    (state) => state.authReducer.user_update_success
  );
  const user_update_failed = useSelector(
    (state) => state.authReducer.user_update_failed
  );
  const user_update_processing = useSelector(
    (state) => state.authReducer.user_update_processing
  );
  const user_update_message = useSelector(
    (state) => state.authReducer.user_update_message
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("chat-app-login-user-data"))
  );

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

  useEffect(() => {
    if (user_update_success && !user_update_processing && !user_update_failed) {
      setUserData(JSON.parse(localStorage.getItem("chat-app-login-user-data")));
      toast.success(user_update_message, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (
      !user_update_success &&
      !user_update_processing &&
      user_update_failed
    ) {
      toast.error(user_update_message, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, [
    user_update_success,
    user_update_processing,
    user_update_failed,
    user_update_message,
  ]);

  const handelLogout = () => {
    toast.success("Logout Success.", { position: toast.POSITION.BOTTOM_LEFT });
    setTimeout(() => {
      dispatch(logoutAccount());
    }, 1500);
  };

  const handelFileUpload = (data) => {
    dispatch(updateUserData(data, userData.token));
  };

  return (
    <div className="relative">
      {/* Profile button */}
      <button
        className="bg-white rounded-full w-11 h-11 flex items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        onClick={handleProfileClick}
      >
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={userData.pic}
          alt="Profile"
        />
      </button>

      {/* Profile popup */}
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 min-w-[200px] w-64 bg-white rounded-md shadow-md border border-gray-200 text-gray-900"
        >
          <div className="p-4 border-b border-gray-200">
            <img
              className="w-20 h-20 rounded-full mx-auto object-cover"
              src={userData.pic}
              alt="Profile"
            />
          </div>

          {/* User info */}
          <div className="p-4 text-center">
            <p className="text-lg font-semibold text-gray-900">
              {userData.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
          </div>


          {/* Logout button */}
          <div className="border-t border-gray-200">
            <button
              onClick={handelLogout}
              className="w-full py-2 px-4 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors rounded-b-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
