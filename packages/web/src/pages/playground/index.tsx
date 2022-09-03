import { ROOM_SOCKET_EVENTS } from "@card-32/common/constant/socket";
import { IRoom } from "@card-32/common/types/room";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Board from "../../components/organisms/board";
import PlaygroundSidebar from "../../components/organisms/playground/PlaygroundSidebar";
import { BASE_URL } from "../../constants/config";
import { useAuthContext } from "../../contexts/AuthProvider";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useThemeContext } from "../../contexts/ThemeProvider";
import { HOME } from "../../routes/routes";

const Playground: React.FC = () => {
  const navigate = useNavigate();
  const { room, setRoom } = useRoomContext();
  const { user, accessToken } = useAuthContext();
  const { sidebarOrder } = useThemeContext();
  const [roomSocket, setRoomSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (!accessToken) return;
    console.log(accessToken, user?._id, room?.roomId);
    console.log(user?._id);
    console.log(room?.roomId);
    if (!room?.roomId) return;
    if (!user?._id) return;

    const roomSocket = io(`${BASE_URL}/room`, {
      query: {
        roomId: room.roomId,
        playerId: user._id,
      },
      auth: {
        token: accessToken,
      },
    });
    console.log(
      "🚀 ~ file: index.tsx ~ line 35 ~ useEffect ~ roomSocket",
      roomSocket
    );

    if (!roomSocket.active) {
      navigate(HOME);
      return;
    }
    setRoomSocket(roomSocket);

    // new player join
    roomSocket.on(
      ROOM_SOCKET_EVENTS["PLAYER::JOINED"],
      ({ room }: { room: IRoom }) => {
        setRoom(room);
      }
    );

    // update room
    roomSocket.on(
      ROOM_SOCKET_EVENTS["UPDATE::ROOM"],
      ({ room }: { room: IRoom }) => {
        setRoom(room);
      }
    );
  }, [room?.roomId, user?._id, accessToken, navigate, setRoom]);

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
