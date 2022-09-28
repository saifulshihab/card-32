import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IBidPoint, IRoom } from "@card-32/common/types/room";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useSocketContext } from "./SocketProvider";

interface IRoomContext {
  room: IRoom | undefined;
  isRoomFull: boolean;
  isGameStarted: boolean;
  activeRooms: IRoom[];
  bidPoints: IBidPoint[];
  setRoom: React.Dispatch<React.SetStateAction<IRoom | undefined>>;
  setIsGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setBidPoints: React.Dispatch<React.SetStateAction<IBidPoint[]>>;
}

const RoomContext = React.createContext<IRoomContext | null>(null);

export const RoomProvider: React.FC<PropsWithChildren> = (props) => {
  const { socket } = useSocketContext();
  const [activeRooms] = useState<IRoom[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [room, setRoom] = useState<IRoom | undefined>(undefined);
  const [bidPoints, setBidPoints] = useState<IBidPoint[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on(MAIN_NAMESPACE_EVENTS.NEW_BID, (data: IBidPoint) => {
      setBidPoints((prev) => [...prev, data]);
    });

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.NEW_BID);
    };
  }, [socket]);

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        bidPoints,
        activeRooms,
        isGameStarted,
        setBidPoints,
        setIsGameStarted,
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
