import { IPlayer } from "@card-32/common/types/player";
import React, { PropsWithChildren, useState } from "react";
import { getPlayerAndRoomIdFromLocalStorage } from "../utils/localStorage";

interface IInitialState {
  player?: IPlayer;
}

let initialState: IInitialState = {};

const localStoragePlayerAndRoom = getPlayerAndRoomIdFromLocalStorage();
if (localStoragePlayerAndRoom) {
  const { player } = localStoragePlayerAndRoom;
  initialState = {
    player,
  };
}

interface IAuthContext {
  player: IPlayer | undefined;
  setPlayer: React.Dispatch<React.SetStateAction<IPlayer | undefined>>;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const [player, setPlayer] = useState<IPlayer | undefined>(
    initialState.player
  );
  return (
    <AuthContext.Provider value={{ player, setPlayer }}>
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
