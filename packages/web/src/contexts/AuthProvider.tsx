import { IPlayer } from "@card-32/common/types/player";
import React, { PropsWithChildren, useState } from "react";
import { getPlayerAndRoomIdFromLocalStorage } from "../utils/localStorage";

interface IInitialState {
  player?: IPlayer;
  roomId?: string;
}

let initialState: IInitialState = {};

const localStoragePlayerAndRoom = getPlayerAndRoomIdFromLocalStorage();
if (localStoragePlayerAndRoom) {
  const { player, roomId } = localStoragePlayerAndRoom;
  initialState = {
    player,
    roomId,
  };
}

interface IAuthContext {
  player: IPlayer | undefined;
  roomId: string | undefined;
  setPlayer: React.Dispatch<React.SetStateAction<IPlayer | undefined>>;
  setRoomId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const [player, setPlayer] = useState<IPlayer | undefined>(
    initialState.player
  );
  const [roomId, setRoomId] = useState<string | undefined>(initialState.roomId);
  return (
    <AuthContext.Provider value={{ player, roomId, setPlayer, setRoomId }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error("AuthContext must be used within AuthProvider");
  }
  return context;
};
