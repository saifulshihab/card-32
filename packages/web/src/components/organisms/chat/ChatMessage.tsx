import { TGenericMessage } from "@card-32/common/types/player";
import React, { useMemo } from "react";
import { colors } from "../../../utils/color";

interface IProps {
  message: TGenericMessage;
}

const ChatMessage: React.FC<IProps> = (props) => {
  const { message } = props;
  const colorIndex = useMemo(() => Math.floor(Math.random() * 6), []);
  return (
    <div className="flex gap-1">
      {message.username ? (
        <>
          <p>
            <span
              style={{
                color: `${colors[colorIndex]}`,
              }}
              className="font-semibold"
            >
              {message.username}
            </span>
          </p>
          <span className="font-bold">:</span>
        </>
      ) : (
        <span
          className="font-bold"
          style={{
            color: `${colors[colorIndex]}`,
          }}
        >
          :
        </span>
      )}
      <p>{message.message}</p>
    </div>
  );
};

export default ChatMessage;
