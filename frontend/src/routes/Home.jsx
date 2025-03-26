import React, { useEffect, useState } from "react";
import AllChats from "../components/Home/AllChats";
import ChatBox from "../components/Home/ChatBox";
import { io } from "socket.io-client";
import * as types from "../redux/appReducer/actionType";
import { useDispatch } from "react-redux";

const ENDPOINT = "http://localhost:5000";

const Home = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const socket = io(ENDPOINT);
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = JSON.parse(
      localStorage.getItem("chat-app-login-user-data")
    );

    socket.on("connect", () => {
      setIsLoading(false);
    });

    socket.emit("setup", userData);
    socket.on("connection", () => setSocketConnected(true));

    dispatch({ type: types.WEB_SOCKET_CONNECTED, payload: socket });

    // Cleanup function to disconnect socket
    return () => {
      socket.disconnect();
    };
  }, [dispatch, socket]);

  return (
    <div className="flex flex-wrap justify-between h-screen max-h-full bg-white">
      {/* Left sidebar - All Chats */}
      <div className="w-full lg:w-1/4 border-r border-gray-200 shadow-md hidden lg:block">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
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
        ) : (
          <AllChats />
        )}
      </div>

      {/* Main content - Chat Box */}
      <div className="w-full lg:w-3/4 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
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
        ) : (
          <ChatBox />
        )}
      </div>
    </div>
  );
};

export default Home;
