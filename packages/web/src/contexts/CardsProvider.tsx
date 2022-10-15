import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IBidPoint, ICard } from "@card-32/common/types/card";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useRoomContext } from "./RoomProvider";
import { useSocketContext } from "./SocketProvider";

interface ICardsContext {
  cards: ICard[];
  bidPoints: IBidPoint[] | null;
}

const CardsContext = React.createContext<ICardsContext | null>(null);

export const CardsProvider: React.FC<PropsWithChildren> = (props) => {
  const { socket } = useSocketContext();
  const { isRoomFull } = useRoomContext();
  const [cards, setCards] = useState<ICard[]>([]);
  const [bidPoints, setBidPoints] = useState<IBidPoint[] | null>(null);

  useEffect(() => {
    if (!socket) return;

    // start game
    socket.on(
      MAIN_NAMESPACE_EVENTS.GET_CARDS,
      ({ data }: { data: { cards: ICard[] } }) => {
        if (data) {
          setCards(data.cards);
          setBidPoints([]);
        }
      }
    );

    // on new bid
    socket.on(
      MAIN_NAMESPACE_EVENTS.NEW_BID,
      ({ data }: { data: { bid: IBidPoint } }) => {
        if (data) {
          setBidPoints((prev) => [...(prev || []), data.bid]);
        }
      }
    );

    // reset game if player leave or disconnected
    if (!isRoomFull) {
      setCards([]);
      setBidPoints(null);
    }

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.GET_CARDS);
      socket.off(MAIN_NAMESPACE_EVENTS.NEW_BID);
    };
  }, [socket, isRoomFull]);

  return (
    <CardsContext.Provider
      value={{
        cards,
        bidPoints,
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
