import { ICard } from "@card-32/common/types/card";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useSocketContext } from "./SocketProvider";

interface ICardsContext {
  cards: ICard[];
}

const CardsContext = React.createContext<ICardsContext | null>(null);

export const CardsProvider: React.FC<PropsWithChildren> = (props) => {
  const { socket } = useSocketContext();
  const [cards, setCards] = useState<ICard[]>([]);

  useEffect(() => {
    socket?.on("receiveCards", ({ cards }: { cards: ICard[] }) => {
      setCards(cards);
    });
  }, [socket]);

  return (
    <CardsContext.Provider
      value={{
        cards,
      }}
    >
      {props.children}
    </CardsContext.Provider>
  );
};

export const useCardsContext = () => {
  const context = React.useContext(CardsContext);
  if (context === null) {
    throw new Error("CardContext must be used within CardProvider");
  }
  return context;
};
