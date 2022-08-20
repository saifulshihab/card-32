import { MAIN_SOCKET_EVENTS } from "@card-32/common/constant/socket";
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
  const { mainSocket } = useSocketContext();
  const [room, setRoom] = useState<IRoom | undefined>(undefined);
  const [activeRooms, setActiveRooms] = useState<IRoom[]>([]);

  useEffect(() => {
    if (!mainSocket) return;

    // active rooms
    mainSocket.on(MAIN_SOCKET_EVENTS["ACTIVE::ROOMS"], ({ activeRooms }) => {
      setActiveRooms(activeRooms);
    });

    // check player
    mainSocket.on(
      MAIN_SOCKET_EVENTS["CHECK::PLAYER"],
      ({ room }: { room: IRoom }) => {
        if (room) {
          setRoom(room);
        }
      }
    );

    // new room
    mainSocket.on(MAIN_SOCKET_EVENTS["NEW::ROOM"], (newRoom: IRoom) => {
      setActiveRooms((prev) => [...prev, newRoom]);
    });
  }, [mainSocket]);

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
