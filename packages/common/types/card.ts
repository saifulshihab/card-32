export interface ICard {
  cardId: string;
  playerId: string;
  value: number;
}

export interface IBidPoint {
  playerId: string;
  username: string;
  bid: number;
  point: number;
}
