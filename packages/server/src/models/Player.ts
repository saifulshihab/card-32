export interface IPlayer {
  playerId: string;
  username: string;
}

class Player implements IPlayer {
  public playerId: string;

  public username: string;

  constructor(playerId: string, username: string) {
    this.playerId = playerId;
    this.username = username;
  }
}

export default Player;
