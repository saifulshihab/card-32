import { TGenericMessage } from "@card-32/common/types/player";
import React, { useMemo } from "react";
import { colors } from "../../../utils/color";

// some random emoji for global chat username
export const emoji: string[] = [
  "🤡",
  "🤪",
  "💩",
  "😈",
  "👻",
  "💀",
  "👽",
  "🦸",
  "🥷",
  "🫅",
  "🧚‍♀️",
  "🧜‍♀️",
  "🧞",
  "🧚‍♂️",
  "🦁",
  "🐝",
  "🦉",
  "🐔",
  "🐼",
  "🌳",
  "🦜",
  "⛄️",
  "🍀",
  "🐿",
  "🐇",
  "🐕",
  "🍎",
  "🍇",
  "🍉",
  "🥑",
  "🍒",
  "🍗",
  "🫐",
  "🍭",
  "🥣",
];

interface IProps {
  message: TGenericMessage;
}

const ChatMessage: React.FC<IProps> = (props) => {
  const { message } = props;
  const colorIndex = useMemo(() => Math.floor(Math.random() * 6), []);
  const emojiIndex = useMemo(() => Math.floor(Math.random() * 34), []);
  return (
    <div className="flex gap-1">
      {message.username ? (
        <p
          style={{
            color: `${colors[colorIndex]}`,
          }}
          className="font-semibold"
        >
          {message.username}
        </p>
      ) : (
        <span role="img" aria-label="emoji">
          {emoji[emojiIndex]}
        </span>
      )}

      <span
        className="font-bold"
        style={{
          color: `${colors[colorIndex]}`,
        }}
      >
        :
      </span>

      <p>{message.message}</p>
    </div>
  );
};

export default ChatMessage;
