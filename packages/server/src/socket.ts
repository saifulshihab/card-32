import { Server, Socket } from "socket.io";
import {
  getPlayerIntoRoom,
  getRoomOnLeaveOrDisconnect,
  updateRoomSettings,
} from "./controller/roomController";
import { IPlayer } from "./models/Player";
import { IRoom, IRoomSettings } from "./models/Room";
import { rooms } from "./server";
import { IBidPoint, ICard } from "./types/card";
import { IGlobalMessage, IMessage } from "./types/player";
import {
  IRoomCreateIOrJoinInput,
  IRoomCreateOrJoinResponse,
  IRoomJoinRequestInput,
  TRoomJoinRequestStatus,
} from "./types/room";
import { generateCards, isRoomExist } from "./utils/roomUtils";
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
  GET_CARDS: "get::cards",
  ON_BID: "on::bid",
  NEW_BID: "new::bid",
  CARD_DROPPED: "card::dropped",
  RECEIVE_DROPPED_CARD: "receive::dropped::card",
  ROUND_WINNER: "round::winner",
  CHANGE_ROOM_SETTINGS: "change::room::settings",
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

  const getSocketRoomId = (socket: Socket) => socket.data.room.roomId as string;
  const getSocketRoom = (socket: Socket) =>
    rooms.find((room) => room.roomId === socket.data.room.roomId);
  const getSocketPlayerId = (socket: Socket) =>
    socket.data.player.playerId as string;

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
            logger.error("join room: data not found");
            return;
          }

          // join room
          socket.join(roomId);
          socket.data.player = data?.player;
          socket.data.room = data?.room!;
          socket.join(socket.id);

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
          logger.error("error in join room", err);
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

          // join request auto accept in room
          if (room.settings.autoAcceptJoinRequest) {
            const { data: roomData } = getPlayerIntoRoom({ username, roomId });
            updateActiveRooms();
            mainNameSpace
              .to(data.socketId)
              .emit(MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE, {
                status: "accepted",
                data: roomData,
              });

            // notify other players
            mainNameSpace
              .to(roomId)
              .emit(MAIN_NAMESPACE_EVENTS.NEW_PLAYER_JOINED, {
                message: `${username} has joined.`,
                room: roomData?.room,
              });
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
          logger.error("error in join request", err);
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
          logger.error("error in join request response", err);
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
          logger.error("error in join request accepted", err);
        }
      }
    );

    /**
     * room chat
     */
    socket.on(MAIN_NAMESPACE_EVENTS.SEND_MESSAGE, (data: IMessage) => {
      try {
        const roomId = getSocketRoomId(socket);
        mainNameSpace
          .to(roomId)
          .emit(MAIN_NAMESPACE_EVENTS.NEW_MESSAGE, { data });
      } catch (err) {
        logger.error("error in send message", err);
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
          logger.error("error in send message - global", err);
        }
      }
    );

    /**
     * start game
     */
    socket.on(MAIN_NAMESPACE_EVENTS.START_GAME, () => {
      try {
        const roomId = getSocketRoomId(socket);
        const { cards } = generateCards(roomId);
        if (cards?.length) {
          mainNameSpace
            .to(roomId)
            .emit(MAIN_NAMESPACE_EVENTS.GET_CARDS, { data: { cards } });
        }
      } catch (err) {
        logger.error("error start game", err);
      }
    });

    /**
     * on receive new bid point
     */
    socket.on(
      MAIN_NAMESPACE_EVENTS.ON_BID,
      (data: { bid: number }, callback) => {
        try {
          const roomId = getSocketRoomId(socket);
          const playerId = getSocketPlayerId(socket);

          if (!roomId || !playerId) {
            callback(undefined);
            logger.error("error in bid");
            return;
          }

          const newBid: IBidPoint = {
            bid: data.bid,
            playerId,
            point: 0,
          };
          mainNameSpace
            .to(roomId)
            .emit(MAIN_NAMESPACE_EVENTS.NEW_BID, { data: { bid: newBid } });
          callback({ data: "Bid done" });
        } catch (err) {
          logger.error("error in bid", err);
        }
      }
    );

    /**
     * on card dropped
     */
    socket.on(
      MAIN_NAMESPACE_EVENTS.CARD_DROPPED,
      ({ data }: { data: { card: ICard } }) => {
        try {
          const roomId = getSocketRoomId(socket);
          const playerId = getSocketPlayerId(socket);

          if (!roomId || !playerId) {
            logger.error("error in card drop");
            return;
          }

          mainNameSpace
            .to(roomId)
            .emit(MAIN_NAMESPACE_EVENTS.RECEIVE_DROPPED_CARD, {
              data: { card: data.card },
            });
        } catch (err) {
          logger.error("error in card drop", err);
        }
      }
    );

    /**
     * send round winner
     */
    socket.on(
      MAIN_NAMESPACE_EVENTS.ROUND_WINNER,
      ({
        data,
      }: {
        data: {
          winnerUsername: string;
          bidPoints: IBidPoint[];
          cards: ICard[];
        };
      }) => {
        try {
          const roomId = getSocketRoomId(socket);
          // time to wait for a round result default 2 sec
          const room = getSocketRoom(socket);
          if (!room) {
            throw new Error("Room not found");
          }
          const delay = room.settings.resultDelay || 2;
          setTimeout(() => {
            mainNameSpace.to(roomId).emit(MAIN_NAMESPACE_EVENTS.ROUND_WINNER, {
              data,
            });
          }, delay * 1000);
        } catch (err) {
          logger.error("error in round winner", err);
        }
      }
    );

    /**
     * update room settings
     */
    socket.on(
      MAIN_NAMESPACE_EVENTS.CHANGE_ROOM_SETTINGS,
      (
        {
          data,
        }: {
          data: {
            settings: IRoomSettings;
          };
        },
        callback
      ) => {
        try {
          const playerId = getSocketPlayerId(socket);
          const roomId = getSocketRoomId(socket);
          const { room } = updateRoomSettings(roomId, data.settings);
          if (room?.creator.playerId !== playerId) {
            callback("Only room creator can change settings", null);
            return;
          }
          if (!room) {
            callback("Something went wrong", null);
            return;
          }
          callback(undefined, room);
        } catch (err) {
          logger.error("error in room settings", err);
        }
      }
    );

    /**
     * leave room
     */
    socket.on(MAIN_NAMESPACE_EVENTS.LEAVE_ROOM, () => {
      try {
        if (!socket.data) {
          logger.error("leave room: socket data not found");
          return;
        }

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
        logger.error("error in leave room", err);
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
        logger.error("error in socket disconnect", err);
      }
    });
  });
};

export { socketIO };
