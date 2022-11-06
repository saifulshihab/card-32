import { IPlayer } from "./player";

export interface IRoomSettings {
  resultDelay?: number;
  autoAcceptJoinRequest?: boolean;
}

export interface IRoom {
  roomId: string;
  players: IPlayer[];
  creator: IPlayer;
  settings: IRoomSettings;
}

export interface IRoomCreateIOrJoinInput {
  username: string; // player username
  roomId: string;
}
export interface IRoomJoinRequestInput {
  socketId: string;
  username: string;
  roomId: string;
  roomCreatorId: string;
}

export interface IRoomCreateOrJoinResponse {
  player: IPlayer;
  room: IRoom;
}

export type TRoomJoinRequestStatus = "accepted" | "rejected";
