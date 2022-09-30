import { rooms } from "../server";

export const isRoomExist = (roomId: string) =>
  rooms.some((room) => room.roomId === roomId);
