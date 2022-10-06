import {
  IGlobalMessage,
  IMessage,
  IPlayer,
} from "@card-32/common/types/player";
import {
  IRoom,
  IRoomCreateIOrJoinInput,
  IRoomCreateOrJoinResponse,
  IRoomJoinRequestInput,
  TRoomJoinRequestStatus,
} from "@card-32/common/types/room";
import { Server, Socket } from "socket.io";
import {
  getPlayerIntoRoom,
  getRoomOnLeaveOrDisconnect,
} from "./controller/roomController";
import { rooms } from "./server";
import { isRoomExist } from "./utils/roomUtils";
import { logger } from "./utils/winston";

const MAIN_NAMESPACE_EVENTS = {
  ACTIVE_ROOMS: "active::rooms",
  GLOBAL_SEND_MESSAGE: "global::send::message",
  GLOBAL_NEW_MESSAGE: "global::new::message",
  ROOM_DATA: "room::data",
  JOIN_ROOM: "join::room",
  JOIN_REQUEST: "join::request",
  JOIN_REQUEST_RESPONSE: "join::request::response",
  JOIN_REQUEST_ACCEPTED: "join::request::accepted",
  SEND_MESSAGE: "send::message",
  NEW_MESSAGE: "new::message",
  NEW_PLAYER_JOINED: "player::joined",
  LEAVE_ROOM: "leave::room",
  PLAYER_DISCONNECTED: "player::disconnected",
  START_GAME: "start::game",
  END_GAME: "end::game",
  RESTART_GAME: "restart::game",
};

const socketIO = (server: Server) => {
  /**
   ****************************************************************************
   ****************************** MAIN NAMESPACE ******************************
   ****************************************************************************
   */
  const mainNameSpace = server.of("/");

  const updateActiveRooms = () =>
    mainNameSpace.emit(MAIN_NAMESPACE_EVENTS.ACTIVE_ROOMS, { rooms });

  const getRoomId = (socket: Socket) => socket.data.room.roomId as string;

  mainNameSpace.on("connection", (socket: Socket) => {
    /**
     * send active rooms
     * when users enter rooms page this will send the current active rooms
     */
    mainNameSpace.emit(MAIN_NAMESPACE_EVENTS.ACTIVE_ROOMS, { rooms });

    /**
     * create or join room
     * with a username and room ID
     */
    socket.on(
      MAIN_NAMESPACE_EVENTS.JOIN_ROOM,
      (joinInput: IRoomCreateIOrJoinInput, callback) => {
        try {
          // join socket with it's own id - for private events
          socket.join(socket.id);

          const { roomId, username } = joinInput;
          const { error, data } = getPlayerIntoRoom(joinInput);

          if (error) {
            callback({
              error,
            });
            return;
          }

          if (!data) {
            callback({
              error: "Something went wrong.",
            });
            return;
          }

          // join room
          socket.join(roomId);
          socket.data.player = data?.player;
          socket.data.room = data?.room!;

          callback({ data });
          updateActiveRooms();

          const newRoom = data.room.players.length === 1;

          if (newRoom) {
            // join room creator with player Id
            socket.join(data.player.playerId);
          } else {
            // notify others new player joined
            socket.to(roomId).emit(MAIN_NAMESPACE_EVENTS.NEW_PLAYER_JOINED, {
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
     * room join request
     */
    socket.on(
      MAIN_NAMESPACE_EVENTS.JOIN_REQUEST,
      (data: IRoomJoinRequestInput, callback) => {
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
          mainNameSpace
            .to(roomCreatorId)
            .emit(MAIN_NAMESPACE_EVENTS.JOIN_REQUEST, data);

          callback({
            data: {
              message: "Please wait, the room creator will let you in soon.",
            },
          });
        } catch (err) {
          callback({ error: "Something went wrong" });
          logger.error(err);
          logger.info(err);
        }
      }
    );

    /**
     * room join request response from room creator
     */
    socket.on(
      MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE,
      (data: {
        status: TRoomJoinRequestStatus;
        joinRequest: IRoomJoinRequestInput;
      }) => {
        try {
          const { status, joinRequest } = data;
          if (status === "rejected") {
            mainNameSpace
              .to(joinRequest.socketId)
              .emit(MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE, {
                status,
              });
          } else if (status === "accepted") {
            const { username, roomId } = joinRequest;
            const { data } = getPlayerIntoRoom({ username, roomId });

            updateActiveRooms();
            mainNameSpace
              .to(joinRequest.socketId)
              .emit(MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE, {
                status,
                data,
              });

            // notify other players
            mainNameSpace
              .to(roomId)
              .emit(MAIN_NAMESPACE_EVENTS.NEW_PLAYER_JOINED, {
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
      MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_ACCEPTED,
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
     * room chat
     */
    socket.on(MAIN_NAMESPACE_EVENTS.SEND_MESSAGE, (data: IMessage) => {
      try {
        const roomId = getRoomId(socket);
        mainNameSpace
          .to(roomId)
          .emit(MAIN_NAMESPACE_EVENTS.NEW_MESSAGE, { data });
      } catch (err) {
        logger.error(err);
        logger.info(err);
      }
    });

    /**
     * global chat
     */
    socket.on(
      MAIN_NAMESPACE_EVENTS.GLOBAL_SEND_MESSAGE,
      (data: IGlobalMessage) => {
        try {
          mainNameSpace.emit(MAIN_NAMESPACE_EVENTS.GLOBAL_NEW_MESSAGE, {
            data,
          });
        } catch (err) {
          logger.error(err);
          logger.info(err);
        }
      }
    );

    /**
     * leave room
     */
    socket.on(MAIN_NAMESPACE_EVENTS.LEAVE_ROOM, () => {
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
          mainNameSpace.to(room.roomId).emit(MAIN_NAMESPACE_EVENTS.LEAVE_ROOM, {
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
            mainNameSpace
              .to(room.roomId)
              .emit(MAIN_NAMESPACE_EVENTS.PLAYER_DISCONNECTED, {
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

export { socketIO };
