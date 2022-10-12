import React, { PropsWithChildren, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../constants/config";

// Namespaces
const mainNamespace = BASE_URL;

interface ISocketContext {
  isSocketConnected: boolean;
  socket: Socket | undefined;
}

const socket = io(mainNamespace);

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<PropsWithChildren> = (props) => {
  const [isSocketConnected, setSocketConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("connect_error", () => {
      setSocketConnected(false);
    });

    // clean up
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
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
