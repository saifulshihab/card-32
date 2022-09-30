import React, { PropsWithChildren, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { showToastMessage } from "../components/atoms/toast";
import { BASE_URL } from "../constants/config";

// Namespaces
const mainNamespace = BASE_URL;
const roomNamespace = `${BASE_URL}/room`;

interface ISocketContext {
  mainSocket: Socket | undefined;
  roomSocket: Socket | undefined;
  isSocketConnected: boolean;
}

const mainSocket = io(mainNamespace);
const roomSocket = io(roomNamespace);

const SocketContext = React.createContext<ISocketContext | null>(null);

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

    mainSocket.on("connect_error", () => {
      showToastMessage({ type: "error", message: "Socket connection error." });
    });

    // clean up
    return () => {
      mainSocket.off("connect");
      mainSocket.off("disconnect");
      mainSocket.off("connect_error");
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
