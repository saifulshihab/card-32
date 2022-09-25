import { IPlayer } from "@card-32/common/types/player";
import React, { PropsWithChildren, useState } from "react";

interface IAuthContext {
  player: IPlayer | null;
  setPlayer: React.Dispatch<React.SetStateAction<IPlayer | null>>;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const [player, setPlayer] = useState<IPlayer | null>(null);
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
