import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IRoom } from "@card-32/common/types/room";
import React, { PropsWithChildren, useEffect, useState } from "react";
import toast from "react-hot-toast";
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

    // new player joined
    socket.on(
      MAIN_NAMESPACE_EVENTS.NEW_PLAYER_JOINED,
      ({ message, room }: { message: string; room: IRoom }) => {
        setRoom(room);
        toast.success(message, {
          position: "bottom-left",
        });
        if (room.players.length === 4) {
          toast.success("Room is full. Now you can start the game.");
        }
      }
    );

    // player leave
    socket.on(MAIN_NAMESPACE_EVENTS.LEAVE_ROOM, ({ message, room }) => {
      setRoom(room);
      toast(message, {
        position: "bottom-left",
        icon: "⬅️",
      });
    });

    // player disconnect
    socket.on(
      MAIN_NAMESPACE_EVENTS.PLAYER_DISCONNECTED,
      ({ message, room }) => {
        setRoom(room);
        toast(message, {
          position: "bottom-left",
          icon: "⬅️",
        });
      }
    );

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.ACTIVE_ROOMS);
      socket.off(MAIN_NAMESPACE_EVENTS.NEW_PLAYER_JOINED);
      socket.off(MAIN_NAMESPACE_EVENTS.LEAVE_ROOM);
      socket.off(MAIN_NAMESPACE_EVENTS.PLAYER_DISCONNECTED);
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
