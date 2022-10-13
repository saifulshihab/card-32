import { IPlayer } from "./Player";

export interface IRoom {
  roomId: string;
  players: IPlayer[];
  creator: IPlayer;
}

class Room implements IRoom {
  public roomId: string;

  public players: IPlayer[];

  public creator: IPlayer;

  constructor(roomId: string, players: IPlayer[], creator: IPlayer) {
    this.roomId = roomId;
    this.players = players;
    this.creator = creator;
  }
}

export default Room;
