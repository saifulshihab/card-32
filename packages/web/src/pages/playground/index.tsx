import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Board from "../../components/organisms/board";
import PlaygroundSidebar from "../../components/organisms/playground/PlaygroundSidebar";
import { BASE_URL } from "../../constants/config";
import { useAuthContext } from "../../contexts/AuthProvider";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useThemeContext } from "../../contexts/ThemeProvider";

const Playground: React.FC = () => {
  const { room } = useRoomContext();
  const { accessToken } = useAuthContext();
  const { sidebarOrder } = useThemeContext();
  const [roomSocket, setRoomSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (room) {
      const roomSocket = io(`${BASE_URL}/${room.roomId}`, {
        auth: {
          token: accessToken,
        },
      });

      setRoomSocket(roomSocket);
    }
  }, [room, accessToken]);

  if (!roomSocket) return <p>Connecting...</p>;

  return (
    <div className="w-full h-full flex flex-col sm:flex-row gap-1">
      {/* left sidebar */}
      <PlaygroundSidebar />
      {/* board & chat */}
      <div
        className={`flex-1 h-full flex flex-col gap-1 ${
          sidebarOrder === 1 ? "order-2" : "order-1"
        }`}
      >
        <Board />
      </div>
    </div>
  );
};

export default Playground;
