import React from "react";
import UserProfile from "./UserProfile";
import SearchUsers from "./SearchUsers";
import Notification from "./Notification";
import { useSelector } from "react-redux";
import SmallScreenAllChats from "./Home/AllChats/SmallScreenAllChats";

export default function Navbar() {
  const sign_in_success = useSelector(
    (state) => state.authReducer.sign_in_success
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md">
      {/* Display only if user is signed in */}
      {sign_in_success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left section */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Hide SmallScreenAllChats on large screens */}
              <div className="lg:hidden">
                <SmallScreenAllChats />
              </div>
              <SearchUsers />
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4 flex-wrap">
              <Notification />
              <UserProfile />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
