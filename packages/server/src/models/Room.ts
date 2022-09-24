import { IPlayer } from "@card-32/common/types/player";

class Room {
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
