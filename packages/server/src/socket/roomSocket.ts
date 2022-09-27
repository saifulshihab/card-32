/**
 * namespace: "/room"
 */

import { ROOM_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IMessage, IPlayer } from "@card-32/common/types/player";
import { IRoom, IRoomCreateIOrJoinInput } from "@card-32/common/types/room";
import { Namespace, Server, Socket } from "socket.io";
import {
  getPlayerIntoRoom,
  getRoomOnLeaveOrDisconnect,
} from "../controller/roomController";
import { updateActiveRooms } from "./mainSocket";

let io: Namespace;
const events = ROOM_NAMESPACE_EVENTS;

const roomSocketIO = (server: Server) => {
  io = server.of("/room");

  const getRoomId = (socket: Socket) => socket.data.room.roomId as string;

  io.on("connection", (socket: Socket) => {
    console.log("roomSocket", socket.id);
    /**
     * join/create room
     */
    socket.on(
      events.JOIN_ROOM,
      (joinInput: IRoomCreateIOrJoinInput, callback) => {
        const { roomId, username } = joinInput;
        const { error, data, newRoom } = getPlayerIntoRoom(joinInput);

        if (error && !data) {
          callback({
            error,
          });
          return;
        }

        socket.join(joinInput.roomId);
        const player = { username, playerId: data?.playerId! };

        socket.data.player = player;
        socket.data.room = data?.room!;

        callback({ data });
        updateActiveRooms();

        if (!newRoom) {
          // notify others new player joined
          socket.to(roomId).emit(events.NEW_PLAYER_JOINED, {
            message: `${username} has joined.`,
            room: data?.room,
          });
        }
      }
    );

    /**
     * chat - send message
     */
    socket.on(events.SEND_MESSAGE, (data: IMessage) => {
      const roomId = getRoomId(socket);
      io.to(roomId).emit(events.NEW_MESSAGE, { data });
    });

    /**
     * leave room
     */
    socket.on(events.LEAVE_ROOM, () => {
      const { room: socketRoom, player } = socket.data as {
        room: IRoom;
        player: IPlayer;
      };

      socket.leave(socketRoom.roomId);

      const { room } = getRoomOnLeaveOrDisconnect(
        socketRoom.roomId,
        player.playerId
      );

      updateActiveRooms();

      if (room) {
        io.to(room.roomId).emit(events.LEAVE_ROOM, {
          message: `${player.username} has left.`,
          room,
        });
      }
    });

    /**
     * socket disconnected
     */
    socket.on("disconnect", () => {
      const { room: socketRoom, player } = socket.data as {
        room: IRoom;
        player: IPlayer;
      };
      updateActiveRooms();
      // notify to the room if a player has disconnect (for example: close the window)
      if (socketRoom && player) {
        const { room } = getRoomOnLeaveOrDisconnect(
          socketRoom.roomId,
          player.playerId
        );
        if (room) {
          io.to(room.roomId).emit(events.PLAYER_DISCONNECTED, {
            message: `${player.username} has left.`,
            room,
          });
        }
      }
    });
  });
};

export { roomSocketIO };
