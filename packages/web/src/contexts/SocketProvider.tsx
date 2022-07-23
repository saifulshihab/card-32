import React, { PropsWithChildren, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthProvider";

interface ISocketContext {
  socket: Socket;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<PropsWithChildren> = (props) => {
  const { accessToken, logout } = useAuthContext();
  const socket = io("http://localhost:5000", {
    auth: {
      token: accessToken,
    },
  });

  useEffect(() => {
    socket.on("connect_error", (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message);
      logout();
    });
  }, []);

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
