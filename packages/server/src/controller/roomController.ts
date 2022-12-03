import { v4 as uuidV4 } from "uuid";
import Player from "../models/Player";
import Room, { IRoomSettings } from "../models/Room";
import { rooms } from "../server";
import { IRoomCreateIOrJoinInput } from "../types/room";
import { logger } from "../utils/winston";

export const getPlayerIntoRoom = (joinInput: IRoomCreateIOrJoinInput) => {
  try {
    const { username, roomId } = joinInput;
    const room = rooms.find((room) => room.roomId === roomId);

    // player wants to create new room
    if (!room) {
      const playerId = uuidV4();
      const newPlayer = new Player(playerId, username);
      const newRoom = new Room(roomId, [newPlayer], newPlayer, {
        autoAcceptJoinRequest: false,
        resultDelay: 2,
      });

      rooms.push(newRoom);
      const data = { room: newRoom, player: newPlayer };

      return { data };
    }

    // room exist push add player to the room
    // username check
    const usernameTaken = room.players.find(
      (player) => player.username === username
    );

    if (usernameTaken) {
      return { error: "Username taken" };
    }

    // room full check
    if (room.players.length === 4) {
      return { error: "Room is full" };
    }

    const playerId = uuidV4();
    const newPlayer = new Player(playerId, username);
    room.players = [...room.players, newPlayer];

    const data = { room, player: newPlayer };
    return { data };
  } catch (err) {
    logger.error("error in getPlayerIntoRoom", err);
    return { error: "Something went wrong" };
  }
};

export const getRoomOnLeaveOrDisconnect = (
  roomId: string,
  playerId: string
) => {
  try {
    const room = rooms.find((room) => room.roomId === roomId);
    if (!room) {
      return { room: undefined };
    }
    if (room.players.length === 1) {
      // last player wants to leave, remove the rooms from server
      rooms.splice(
        rooms.findIndex((room) => room.roomId === roomId),
        1
      );
      return { room: undefined };
    }

    const newPlayers = room.players.filter(
      (player) => player.playerId !== playerId
    );

    room.players = newPlayers;

    // room creator left, add new room creator
    const isRoomCreatorLeft = room.creator.playerId === playerId;
    const newRoomCreator = { ...newPlayers[0] };
    if (isRoomCreatorLeft) room.creator = newRoomCreator;

    return {
      room,
      newRoomCreatorId: isRoomCreatorLeft ? newRoomCreator.playerId : null,
    };
  } catch (err) {
    logger.error("error in getRoomOnLeaveOrDisconnect", err);
    return { room: undefined };
  }
};

export const updateRoomSettings = (roomId: string, settings: IRoomSettings) => {
  try {
    const room = rooms.find((room) => room.roomId === roomId);
    if (!room) {
      return { room: undefined };
    }
    room.settings = settings;
    return { room };
  } catch (err) {
    logger.error("error in updateRoomSettings", err);
    return { room: undefined };
  }
};
