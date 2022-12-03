import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IBidPoint, ICard } from "@card-32/common/types/card";
import React, { PropsWithChildren, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRoomContext } from "./RoomProvider";
import { useSocketContext } from "./SocketProvider";

interface ICardsContext {
  cards: ICard[];
  bidPoints: IBidPoint[] | null;
  usedCards: ICard[];
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>;
  isBidDone?: boolean;
}

const CardsContext = React.createContext<ICardsContext | null>(null);

export const CardsProvider: React.FC<PropsWithChildren> = (props) => {
  const { socket } = useSocketContext();
  const { isRoomFull } = useRoomContext();
  const [cards, setCards] = useState<ICard[]>([]);
  const [bidPoints, setBidPoints] = useState<IBidPoint[] | null>(null);
  const [usedCards, setUsedCards] = useState<ICard[]>([]);

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

    // on card dropped
    socket.on(
      MAIN_NAMESPACE_EVENTS.RECEIVE_DROPPED_CARD,
      ({ data }: { data: { card: ICard } }) => {
        if (!data.card) return;
        setCards((prev) => prev.filter((d) => d.value !== data.card.value));
        setUsedCards((prev) => [...prev, data.card]);
      }
    );

    // get winner for a round
    socket.on(
      MAIN_NAMESPACE_EVENTS.ROUND_WINNER,
      ({
        data: { winnerUsername, bidPoints, cards },
      }: {
        data: {
          winnerUsername: string;
          bidPoints: IBidPoint[];
          cards: ICard[];
        };
      }) => {
        setBidPoints(bidPoints);
        setUsedCards([]);
        setCards(cards);
        toast.success(
          <p>
            <span className="text-green-500">{winnerUsername}</span> won this
            round
          </p>,
          { icon: "🎉" }
        );
      }
    );

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.GET_CARDS);
      socket.off(MAIN_NAMESPACE_EVENTS.NEW_BID);
      socket.off(MAIN_NAMESPACE_EVENTS.RECEIVE_DROPPED_CARD);
      socket.off(MAIN_NAMESPACE_EVENTS.ROUND_WINNER);
    };
  }, [socket, cards]);

  useEffect(() => {
    // reset game if player leave or disconnected
    if (!isRoomFull) {
      setCards([]);
      setBidPoints(null);
      setUsedCards([]);
    }
  }, [isRoomFull]);

  return (
    <CardsContext.Provider
      value={{
        cards,
        bidPoints,
        usedCards,
        setCards,
        isBidDone: (bidPoints || [])?.length === 4,
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
