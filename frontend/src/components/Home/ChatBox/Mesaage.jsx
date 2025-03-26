import React from "react";

export default function Message({ item }) {
  const parsedData = JSON.parse(
    localStorage.getItem("chat-app-login-user-data")
  );
  const chatAlign =
    parsedData._id === item.sender._id ? "items-end" : "items-start";
  const isCurrentUser = parsedData._id === item.sender._id;

  const createdAt = new Date(item.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex flex-col ${chatAlign} mx-3 my-2`}>
      <div className={`flex gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
        <div className="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-800">
          {item.sender.name
            ? item.sender.name.charAt(0)
            : item.sender.email.charAt(0)}
        </div>

        <div className="flex flex-col">
          <span
            className={`text-xs mb-1 ${
              isCurrentUser ? "text-gray-500 text-right" : "text-gray-500"
            }`}
          >
            {item.sender.name || item.sender.email}
          </span>

          <div
            className={`p-3 text-sm max-w-xs md:max-w-md lg:max-w-lg break-words rounded-lg ${
              isCurrentUser
                ? "bg-indigo-600 text-white rounded-tr-none"
                : "bg-gray-200 text-gray-800 rounded-tl-none"
            }`}
          >

            {item.message && <p>{item.message}</p>}

            {item.image && (
              <img
                src={`http://localhost:5000/${item.image}`}
                alt="Chat attachment"
                className="mt-2 max-w-full rounded-lg"
              />
            )}
          </div>

          <span
            className={`text-xs mt-1 px-1 ${
              isCurrentUser ? "text-gray-500 text-right" : "text-gray-500"
            }`}
          >
            {createdAt}
          </span>
        </div>
      </div>
    </div>
  );
}
