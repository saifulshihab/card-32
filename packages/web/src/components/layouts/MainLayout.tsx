import React, { PropsWithChildren } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useSocketContext } from "../../contexts/SocketProvider";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { isSocketConnected } = useSocketContext();
  return (
    <div className="relative w-full min-h-screen bg-zinc-900 text-zinc-100">
      {children}
      {!isSocketConnected ? (
        <div className="absolute inset-0 flex items-center gap-2 justify-center bg-zinc-700 bg-opacity-70 ">
          <LoaderIcon />
          <p className="text-primary text-lg">Connecting to server...</p>
        </div>
      ) : null}
    </div>
  );
};

export { MainLayout };
