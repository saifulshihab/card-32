import { IRoom, IRoomCreateIOrJoinInput } from "@card-32/common/types/room";
import { v4 as uuidV4 } from "uuid";
import Room from "../models/Room";
import { rooms } from "../server";

export const getPlayerIntoRoom = (joinInput: IRoomCreateIOrJoinInput) => {
  const { username, roomId } = joinInput;

  const room = rooms.find((room) => room.roomId === roomId);

  // player wants to create new room
  if (!room) {
    const playerId = uuidV4();
    const newRoom = new Room(roomId, [{ username, playerId }], {
      username,
      playerId,
    }) as IRoom;
    rooms.push(newRoom);
    const data = { room: newRoom, playerId };
    return { data, newRoom: true };
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
  const newPlayer = { username, playerId };
  room.players = [...room.players, newPlayer];

  const data = { room, playerId };
  return { data };
};

export const getRoomOnLeaveOrDisconnect = (
  roomId: string,
  playerId: string
) => {
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
  room.players = room.players.filter((player) => player.playerId !== playerId);
  return { room };
};
