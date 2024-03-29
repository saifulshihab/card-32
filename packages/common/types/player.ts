export interface IPlayer {
  playerId: string;
  username: string;
}

export interface IMessage {
  username: string;
  message: string;
}

export interface IGlobalMessage {
  message: string;
}

export type TGenericMessage =
  | IMessage
  | (IGlobalMessage & {
      username?: string;
    });
