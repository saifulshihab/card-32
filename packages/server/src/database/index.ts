import { ICard } from "@card-32/common/types/card";
import { IPlayer } from "@card-32/common/types/player";

export const players: IPlayer[] = [];
export const roomPlayers = (roomId: string) =>
  players.filter((player) => player.playerId === roomId);

export const cards: ICard[] = [];
