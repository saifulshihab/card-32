/**
 * namespace: "/"
 * auth: no-auth
 */

import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IMessage, IPlayer } from "@card-32/common/types/player";
import {
  IBidPoint,
  IRoom,
  IRoomCreateIOrJoinInput,
} from "@card-32/common/types/room";
import { Namespace, Server, Socket } from "socket.io";
import {
  getPlayerIntoRoom,
  getRoomOnLeaveOrDisconnect,
} from "../controller/roomController";
import { generateCards } from "../utils/card";

let io: Namespace;
const events = MAIN_NAMESPACE_EVENTS;

const mainSocketIO = (server: Server) => {
  io = server.of("/");

  const getRoomId = (socket: Socket) => socket.data.room.roomId as string;

  io.on(events.CONNECTION, (socket: Socket) => {
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

        if (!newRoom) {
          // notify others that new player joined
          socket.to(roomId).emit(events.NEW_PLAYER_JOINED, {
            message: `${username} has joined.`,
            room: data?.room,
          });
          if (data?.room.players.length === 4) {
            socket.to(roomId).emit(events.ROOM_FULL, {
              message: `Room is full. You can start the game.`,
            });
          }
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
     * start game
     */
    socket.on(events.START_GAME, () => {
      const roomId = getRoomId(socket);
      const { cards } = generateCards(roomId);
      io.to(roomId).emit(events.CARDS_GENERATED, { cards });
    });

    /**
     * on bid point
     */
    socket.on(events.BID_POINT, (data: IBidPoint, callback) => {
      const roomId = getRoomId(socket);
      io.to(roomId).emit(events.NEW_BID, data);
      callback({
        bidDone: true,
      });
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
    socket.on(events.DISCONNECT, () => {
      const { room: socketRoom, player } = socket.data as {
        room: IRoom;
        player: IPlayer;
      };
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

export { mainSocketIO };
