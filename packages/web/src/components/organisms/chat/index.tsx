import { TGenericMessage } from "@card-32/common/types/player";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";

interface IProps {
  isGlobal?: boolean;
  messages: TGenericMessage[];
  handleSendMessage: (message: string, callback?: () => void) => void;
}

const Chat: React.FC<IProps> = (props) => {
  const { isGlobal, messages, handleSendMessage } = props;
  const [message, setMessage] = useState<string>("");
  const scrollDivRef = useRef<HTMLDivElement | null>(null);

  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const scrollIntoChatBottom = () => {
    if (scrollDivRef.current)
      scrollDivRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages) scrollIntoChatBottom();
  }, [messages]);

  const onEmojiClick = useCallback((data: EmojiClickData) => {
    setMessage((prev) => prev + data.emoji);
  }, []);

  const onFormSubmit = (e: any) => {
    if (!message) return;
    e.preventDefault();
    handleSendMessage(message, () => {
      setEmojiPickerVisible(false);
      setMessage("");
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-800">
      <div className="relative py-2 px-3 border-b-4 border-zinc-900">
        <p className="text-2xl font-bold">
          {isGlobal ? "🌏 Global Chat" : "Chat"}
        </p>
      </div>
      {/* messages */}
      <div className="flex flex-grow overflow-hidden">
        <div className="flex h-full flex-col gap-0.5 p-2 pb-0 text-sm overflow-y-scroll scrollbar-hide">
          {messages.map((message, idx) => (
            <ChatMessage key={idx} message={message} />
          ))}
          <div ref={scrollDivRef} />
        </div>
      </div>
      {/* bottom input */}
      <form className="h-16 border-t-4 border-zinc-900" onSubmit={onFormSubmit}>
        <div className="flex h-full px-3 relative gap-2">
          <input
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full bg-transparent text-sm h-full outline-none"
          />
          <div className="flex items-center text-sm gap-3">
            <button
              type="button"
              onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
            >
              <i className="fa-regular fa-face-smile"></i>
            </button>
            <button className="h-full" type="submit">
              <i className="fa-solid fa-paper-plane" />
            </button>
          </div>
          {emojiPickerVisible ? (
            <div className="absolute bottom-[110%] right-[5%]">
              <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} />
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Chat;
