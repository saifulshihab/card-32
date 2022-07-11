import { IPlayer } from "./player";

export interface IRoom {
  roomId: string;
  players: IPlayer[];
}
