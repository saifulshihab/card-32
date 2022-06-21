import { IUser } from "../types/user";

export const users: IUser[] = [];
export const roomUsers = (roomId: string) =>
  users.filter((user) => user.roomId === roomId);
