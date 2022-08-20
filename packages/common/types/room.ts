import { IPlayer } from "./player";

export interface IRoom {
  roomId: string;
  players: IPlayer[];
  creator: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoomCreateInput {
  roomId?: string;
  password?: string;
}
