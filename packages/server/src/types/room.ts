import { IPlayer } from "../models/Player";
import { IRoom } from "../models/Room";

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
