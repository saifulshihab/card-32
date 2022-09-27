import React, { PropsWithChildren, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../constants/config";

// Namespaces
const mainNamespace = BASE_URL;
const roomNamespace = `${BASE_URL}/room`;

interface ISocketContext {
  mainSocket: Socket | undefined;
  roomSocket: Socket | undefined;
  isSocketConnected: boolean;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

const mainSocket = io(mainNamespace);
const roomSocket = io(roomNamespace);

export const SocketProvider: React.FC<PropsWithChildren> = (props) => {
  const [isSocketConnected, setSocketConnected] = useState(
    mainSocket.connected
  );

  useEffect(() => {
    mainSocket.on("connect", () => {
      setSocketConnected(true);
    });

    mainSocket.on("disconnect", () => {
      setSocketConnected(false);
      window.location.reload();
    });

    // clean up
    return () => {
      mainSocket.off("connect");
      mainSocket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        mainSocket,
        roomSocket,
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
