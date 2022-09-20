import { IPlayer } from "./player";

export interface IRoom {
  roomId: string;
  players: IPlayer[];
}

export interface IRoomCreateIOrJoinInput {
  roomId?: string;
  username?: string; // player username
}
