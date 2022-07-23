import { IPlayer } from "./player";

export interface IRoom {
  roomId: string;
  players: IPlayer[];
}

export interface IActiveRoom {
  roomId: string;
  numOfUsers: number;
}
