import React, { PropsWithChildren, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../constants/config";
import { useAuthContext } from "./AuthProvider";

// Namespaces
const mainNamespace = BASE_URL;

interface ISocketContext {
  mainSocket: Socket | undefined;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<PropsWithChildren> = (props) => {
  const { isAuthenticated, accessToken, user } = useAuthContext();
  const [mainSocket, setMainSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated) return;
    const mainSocket = io(mainNamespace, {
      query: {
        playerId: user?._id,
      },
      auth: {
        token: accessToken,
      },
    });

    setMainSocket(mainSocket);

    // mainSocket.on("connect_error", () => {
    //   setMainSocket(undefined);
    // });

    return () => {
      mainSocket.close();
    };
  }, [isAuthenticated, accessToken, user]);

  return (
    <SocketContext.Provider
      value={{
        mainSocket,
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
