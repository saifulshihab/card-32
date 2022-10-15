export interface ICard {
  cardId: string;
  playerId: string;
  value: number;
  used: boolean;
}

export interface IBidPoint {
  playerId: string;
  bid: number;
  point: number;
}
