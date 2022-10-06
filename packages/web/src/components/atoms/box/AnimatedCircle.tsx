import React from "react";

interface IProps {
  socketConnected?: boolean;
}

const AnimatedCircle: React.FC<IProps> = ({ socketConnected }) => {
  return (
    <div
      className={`inline-block relative h-2 w-2 rounded-full shadow ${
        socketConnected ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <span
        className={`${
          !socketConnected ? "hidden" : ""
        }absolute h-2 w-2 rounded-full animate-ping bg-green-600 opacity-75`}
      />
    </div>
  );
};

export default AnimatedCircle;
