import React from "react";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC = (props) => {
  const socket = io("http://localhost:5000");
  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = React.useContext(SocketContext);
  if (context === null) {
    throw new Error("SocketContext must be used within SocketProvider");
  }
  return context;
};
