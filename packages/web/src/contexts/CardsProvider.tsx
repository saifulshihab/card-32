import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { ICard } from "@card-32/common/types/card";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useRoomContext } from "./RoomProvider";
import { useSocketContext } from "./SocketProvider";

interface ICardsContext {
  cards: ICard[];
}

const CardsContext = React.createContext<ICardsContext | null>(null);

export const CardsProvider: React.FC<PropsWithChildren> = (props) => {
  const { socket } = useSocketContext();
  const { setIsGameStarted } = useRoomContext();
  const [cards, setCards] = useState<ICard[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      MAIN_NAMESPACE_EVENTS.CARDS_GENERATED,
      ({ cards }: { cards: ICard[] }) => {
        setCards(cards);
        setIsGameStarted(true);
      }
    );

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.CARDS_GENERATED);
    };
  }, [socket, setIsGameStarted]);

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
