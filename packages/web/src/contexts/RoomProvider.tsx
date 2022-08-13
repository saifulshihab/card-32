import { IRoom, IActiveRoom } from "@card-32/common/types/room";
import { IPlayer } from "@card-32/common/types/player";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { getPlayerFromLocalStorage } from "../utils/localStorage";
import { useSocketContext } from "./SocketProvider";

interface IRoomContext {
  room: IRoom | null;
  isRoomFull: boolean;
  player: IPlayer | undefined;
  activeRooms: IActiveRoom[];
}

const RoomContext = React.createContext<IRoomContext | null>(null);

export const RoomProvider: React.FC<PropsWithChildren> = (props) => {
  const { socket } = useSocketContext();
  const [room, setRoom] = useState<IRoom | null>(null);
  const [activeRooms] = useState<IActiveRoom[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("roomData", (roomData: IRoom) => {
      setRoom(roomData);
    });
  }, [socket]);

  const playerFromLocalStorage = getPlayerFromLocalStorage();

  return (
    <RoomContext.Provider
      value={{
        room,
        activeRooms,
        isRoomFull: room?.players.length === 4,
        player: playerFromLocalStorage?.player,
      }}
    >
      {props.children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = React.useContext(RoomContext);
  if (context === null) {
    throw new Error("RoomContext must be used within RoomProvider");
  }
  return context;
};
