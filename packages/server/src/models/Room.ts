import { IPlayer } from "./Player";

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

class Room implements IRoom {
  public roomId: string;

  public players: IPlayer[];

  public creator: IPlayer;

  public settings: IRoomSettings;

  constructor(
    roomId: string,
    players: IPlayer[],
    creator: IPlayer,
    settings: IRoomSettings
  ) {
    this.roomId = roomId;
    this.players = players;
    this.creator = creator;
    this.settings = settings;
  }
}

export default Room;
