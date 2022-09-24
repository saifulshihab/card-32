import { IPlayer } from "./player";

export interface IRoom {
  roomId: string;
  players: IPlayer[];
  creator: IPlayer;
}

export interface IRoomCreateIOrJoinInput {
  username: string; // player username
  roomId: string;
}
