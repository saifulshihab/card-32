import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IRoom } from "@card-32/common/types/room";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useSocketContext } from "./SocketProvider";

interface IRoomContext {
  room: IRoom | undefined;
  isRoomFull: boolean;
  activeRooms: IRoom[];
  setRoom: React.Dispatch<React.SetStateAction<IRoom | undefined>>;
}

const RoomContext = React.createContext<IRoomContext | null>(null);

export const RoomProvider: React.FC<PropsWithChildren> = (props) => {
  const { socket } = useSocketContext();
  const [activeRooms, setActiveRooms] = useState<IRoom[]>([]);

  const [room, setRoom] = useState<IRoom | undefined>(undefined);

  useEffect(() => {
    if (!socket) return;

    // receive active rooms
    socket.on(
      MAIN_NAMESPACE_EVENTS.ACTIVE_ROOMS,
      (data: { rooms: IRoom[] }) => {
        setActiveRooms(data.rooms);
      }
    );

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.ACTIVE_ROOMS);
    };
  }, [socket]);

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        activeRooms,
        isRoomFull: room?.players.length === 4,
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
