import React, { useEffect, useState } from "react";
import { BsEmojiSmile, BsSendFill } from "react-icons/bs";
import Message from '../Home/ChatBox/Mesaage'
import ChatHeader from "./ChatBox/ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/white-logo.png";
import { toast, ToastContainer } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";
import {
  sendMessage,
  setWebSocketReceivedMessage,
} from "../../redux/appReducer/action";

export default function ChatBox() {
  const selectedUserForChat = useSelector(
    (state) => state.appReducer.selectedUserForChat
  );
  const sendMessageSuccess = useSelector(
    (state) => state.appReducer.sendMessageSuccess
  );
  const sendMessageFail = useSelector(
    (state) => state.appReducer.sendMessageFail
  );
  const sendMessageObj = useSelector(
    (state) => state.appReducer.sendMessageObj
  );
  const sendMessageProcessing = useSelector(
    (state) => state.appReducer.sendMessageProcessing
  );
  const notficationsMessages = useSelector(
    (state) => state.appReducer.notficationsMessages
  );
  const getMessageProcessing = useSelector(
    (state) => state.appReducer.getMessageProcessing
  );
  const getMessageData = useSelector(
    (state) => state.appReducer.getMessageData
  );
  const webSocket = useSelector((state) => state.appReducer.webSocket);

  const [userInput, setUserInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // State for image file
  const dispatch = useDispatch();

  const handleSendMessage = () => {
    if (!userInput.trim() && !selectedImage) {
      toast.warn("Write something or select an image to send", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    }

    const formData = new FormData();
    formData.append("content", userInput.trim());
    formData.append("chatId", selectedUserForChat._id);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    dispatch(sendMessage(formData));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image (JPEG, PNG, GIF)", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        return;
      }
      setSelectedImage(file);
    }
  };

  useEffect(() => {
    if (!sendMessageProcessing && !sendMessageFail && sendMessageSuccess) {
      setUserInput("");
      setSelectedImage(null); // Reset image after successful send
      webSocket.emit("new message", sendMessageObj);
      dispatch(
        setWebSocketReceivedMessage(
          getMessageData,
          sendMessageObj,
          notficationsMessages,
          selectedUserForChat
        )
      );
    }

    if (!sendMessageProcessing && sendMessageFail && !sendMessageSuccess) {
      toast.error("Message not sent. Try again.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, [
    sendMessageSuccess,
    sendMessageFail,
    sendMessageProcessing,
    dispatch,
    webSocket,
    sendMessageObj,
    getMessageData,
    notficationsMessages,
    selectedUserForChat,
  ]);

  useEffect(() => {
    const handleNewMessageReceived = (newMessageRec) => {
      dispatch(
        setWebSocketReceivedMessage(
          getMessageData,
          newMessageRec,
          notficationsMessages,
          selectedUserForChat
        )
      );
    };

    webSocket.on("message received", handleNewMessageReceived);

    return () => {
      webSocket.off("message received", handleNewMessageReceived);
    };
  }, [
    webSocket,
    selectedUserForChat,
    getMessageData,
    notficationsMessages,
    dispatch,
  ]);

  if (!selectedUserForChat) {
    return (
      <div className="flex flex-col h-full bg-white rounded-md border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center justify-center h-full">
          <img className="w-20 h-20 mr-2" src={logo} alt="logo" />
          <p className="text-gray-600">Enjoy Your Chat!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ChatHeader />

      <div className="flex flex-col h-full bg-white rounded-md border border-gray-200 shadow-sm">
        <div className="flex h-full flex-col max-h-[75vh] overflow-y-auto bg-gray-50 rounded-t-md p-4">
          {getMessageProcessing ? (
            <div className="flex flex-col items-center justify-center h-full">
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
              <span className="mt-2 text-gray-600">Loading Messages</span>
            </div>
          ) : (
            <ScrollableFeed>
              {Array.isArray(getMessageData) && getMessageData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <img className="w-20 h-20 mr-2" src={logo} alt="logo" />
                  <p className="text-gray-600">Start Chatting!</p>
                </div>
              ) : (
                Array.isArray(getMessageData) &&
                getMessageData.map((item) => (
                  <Message item={item} key={item._id} /> // Use _id instead of id
                ))
              )}
            </ScrollableFeed>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="relative flex items-center space-x-2">
            <input
              disabled={sendMessageProcessing}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              type="text"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 sm:text-sm pr-20"
              placeholder="Type your message..."
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={sendMessageProcessing}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <button
              type="button"
              className="px-2 py-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              <BsEmojiSmile className="w-5 h-5" />
            </button>
            <button
              disabled={sendMessageProcessing}
              type="button"
              className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
            >
              {sendMessageProcessing ? (
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
                  Sending
                </div>
              ) : (
                <BsSendFill className="w-5 h-5" />
              )}
            </button>
          </div>
          {selectedImage && (
            <div className="mt-2 text-sm text-gray-600">
              Selected image: {selectedImage.name}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
