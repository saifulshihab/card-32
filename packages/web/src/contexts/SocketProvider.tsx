import React, { PropsWithChildren, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../constants/config";
import { useAuthContext } from "./AuthProvider";

interface ISocketContext {
  socket: Socket | undefined;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<PropsWithChildren> = (props) => {
  const { isAuthenticated, accessToken } = useAuthContext();

  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated) return;
    const socket = io(BASE_URL, {
      auth: {
        token: accessToken,
      },
    });
    setSocket(socket);

    socket.on("connect_error", (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

    return () => {
      socket.close();
    };
  }, [isAuthenticated, accessToken]);

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
