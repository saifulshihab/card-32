import { IPlayer } from "./player";

export interface IRoom {
  roomId: string;
  players: IPlayer[];
  creator: string;
}

export interface IActiveRoom {
  roomId: string;
  numOfUsers: number;
}
