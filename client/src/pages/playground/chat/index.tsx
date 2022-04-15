import React from "react";

const messages: {
  user: string;
  message: string;
}[] = [
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
  {
    user: "shihab",
    message: "Hi",
  },
  {
    user: "shihab",
    message: "hello world",
  },
  {
    user: "shihab",
    message: "how are you",
  },
  {
    user: "shihab",
    message: "whats's going on",
  },
  {
    user: "shihab",
    message: "damn",
  },
  {
    user: "shihab",
    message:
      "bro this is lit, this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit this is lit",
  },
];

const Chat: React.FC = () => {
  return (
    <div className="w-96 h-full bg-gray-800 flex flex-col">
      <div className="relative py-2 px-3 border-b-4 border-gray-900">
        <p className="text-2xl font-bold">Chat</p>
      </div>
      {/* messages */}
      <div className="flex flex-grow overflow-hidden">
        <div className="flex h-full flex-col gap-1.5 p-2 text-xs overflow-y-scroll scrollbar-hide">
          {messages.map((m) => (
            <div className="flex items-center">
              <p>
                <span className="text-blue-500">{m.user}</span> : {m.message}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* bottom input */}
      <div className="h-16 border-t-4 border-gray-900">
        <div className="flex items-center h-full px-2">
          <input
            className="w-full bg-transparent text-sm h-full outline-none"
            placeholder="Write your message here..."
          />
          <button className="h-full">
            <i className="fa-solid fa-paper-plane" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
