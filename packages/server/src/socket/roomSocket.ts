/**
 * namespace: "/room"
 */

import { ROOM_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IMessage, IPlayer } from "@card-32/common/types/player";
import {
  IRoom,
  IRoomCreateIOrJoinInput,
  IRoomCreateOrJoinResponse,
  IRoomJoinRequestInput,
  TRoomJoinRequestStatus,
} from "@card-32/common/types/room";
import { Namespace, Server, Socket } from "socket.io";
import {
  getPlayerIntoRoom,
  getRoomOnLeaveOrDisconnect,
} from "../controller/roomController";
import { rooms } from "../server";
import { isRoomExist } from "../utils/roomUtils";
import { logger } from "../utils/winston";
import { updateActiveRooms } from "./mainSocket";

let io: Namespace;
const events = ROOM_NAMESPACE_EVENTS;

const roomSocketIO = (server: Server) => {
  io = server.of("/room");

  const getRoomId = (socket: Socket) => socket.data.room.roomId as string;

  io.on("connection", (socket: Socket) => {
    /**
     * create or join room
     * with a username and room ID
     */
    socket.on(
      events.JOIN_ROOM,
      (joinInput: IRoomCreateIOrJoinInput, callback) => {
        try {
          // join socket it's own id - for private events
          socket.join(socket.id);

          const { roomId, username } = joinInput;
          const { error, data, newRoom } = getPlayerIntoRoom(joinInput);

          if (error && !data) {
            callback({
              error,
            });
            return;
          }

          // join room
          socket.join(roomId);

          socket.data.player = data?.player;
          socket.data.room = data?.room!;

          callback({ data });
          updateActiveRooms();

          if (newRoom) {
            // join creator into own room
            socket.join(data.player.playerId);
          } else {
            // notify others new player joined
            socket.to(roomId).emit(events.NEW_PLAYER_JOINED, {
              message: `${username} has joined.`,
              room: data?.room,
            });
          }
        } catch (err) {
          callback({ error: "Something went wrong" });
          logger.error(err);
          logger.info(err);
        }
      }
    );

    /**
     * chat - send message
     */
    socket.on(events.SEND_MESSAGE, (data: IMessage) => {
      try {
        const roomId = getRoomId(socket);
        io.to(roomId).emit(events.NEW_MESSAGE, { data });
      } catch (err) {
        logger.error(err);
        logger.info(err);
      }
    });

    /**
     * room join request
     */
    socket.on(events.JOIN_REQUEST, (data: IRoomJoinRequestInput, callback) => {
      try {
        const { username, roomId, roomCreatorId } = data;
        const room = rooms.find((room) => room.roomId === roomId);
        // no room found
        if (!room) {
          callback({ error: "Room not found" });
          return;
        }

        // check room already has a player with this username
        const usernameTaken = room.players.find(
          (player) => player.username === username
        );

        if (usernameTaken) {
          callback({
            error: "Username taken!",
          });
          return;
        }

        // room full
        if (room.players.length === 4) {
          callback({ error: "Room is full" });
          return;
        }

        // send join request to room creator
        io.to(roomCreatorId).emit(events.JOIN_REQUEST, data);

        callback({
          data: {
            message: "Request was sent to room creator.",
          },
        });
      } catch (err) {
        callback({ error: "Something went wrong" });
        logger.error(err);
        logger.info(err);
      }
    });

    /**
     * room join request response from room creator
     */
    socket.on(
      events.JOIN_REQUEST_RESPONSE,
      (data: {
        status: TRoomJoinRequestStatus;
        joinRequest: IRoomJoinRequestInput;
      }) => {
        try {
          const { status, joinRequest } = data;
          if (status === "rejected") {
            io.to(joinRequest.socketId).emit(events.JOIN_REQUEST_RESPONSE, {
              status,
            });
          } else if (status === "accepted") {
            const { username, roomId } = joinRequest;
            const { data } = getPlayerIntoRoom({ username, roomId });

            updateActiveRooms();

            io.to(joinRequest.socketId).emit(events.JOIN_REQUEST_RESPONSE, {
              status,
              data,
            });

            // notify other players
            io.to(roomId).emit(events.NEW_PLAYER_JOINED, {
              message: `${username} has joined.`,
              room: data?.room,
            });
          }
        } catch (err) {
          logger.error(err);
          logger.info(err);
        }
      }
    );

    /**
     * join the player into room
     * after creator accept the request
     */
    socket.on(
      events.JOIN_REQUEST_ACCEPTED,
      ({ data }: { data: IRoomCreateOrJoinResponse }, callback) => {
        try {
          const { room, player } = data;
          if (isRoomExist(room.roomId)) {
            // join room
            socket.join(room.roomId);
            socket.data.player = player;
            socket.data.room = room;

            callback({ data: { message: `Welcome ${player.username}.` } });
          } else {
            callback({ error: "Room not found" });
          }
        } catch (err) {
          callback({ error: "Something went wrong" });
          logger.error(err);
          logger.info(err);
        }
      }
    );

    /**
     * leave room
     */
    socket.on(events.LEAVE_ROOM, () => {
      try {
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
      } catch (err) {
        logger.error(err);
        logger.info(err);
      }
    });

    /**
     * socket disconnected
     */
    socket.on("disconnect", () => {
      try {
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
      } catch (err) {
        logger.error(err);
        logger.info(err);
      }
    });
  });
};

export { roomSocketIO };
