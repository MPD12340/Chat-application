import React, { useState, useEffect, useRef } from "react";
import { BiSolidBell } from "react-icons/bi";
import { useSelector } from "react-redux";

export default function Notification() {
  const notifications = useSelector(
    (state) => state.appReducer.notficationsMessages
  );
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
      <button
        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors relative"
        onClick={handleProfileClick}
        aria-label="Notifications"
      >
        <BiSolidBell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 max-h-96 overflow-y-auto"
        >
          <div className="py-1">
            <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
              Notifications
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={`${item._id}-${item.createdAt}`}
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-indigo-600">
                      {item.sender.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
