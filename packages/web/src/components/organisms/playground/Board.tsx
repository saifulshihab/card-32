import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { ICard } from "@card-32/common/types/card";
import { DNDType } from "@card-32/common/types/dnd";
import React from "react";
import { useDrop } from "react-dnd";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { useCardsContext } from "../../../contexts/CardsProvider";
import { useSocketContext } from "../../../contexts/SocketProvider";
import { Card } from "./card/Card";
import { FlipCard } from "./card/FlipCard";

const Board: React.FC = () => {
  const { player } = useAuthContext();
  const { socket } = useSocketContext();
  const { cards, bidPoints, usedCards } = useCardsContext();
  const [{ isOver }, drop] = useDrop(
    {
      accept: DNDType.CARD,
      collect: (monitor) => {
        return {
          isOver: !!monitor.isOver(),
        };
      },
      drop: ({ card }: { card: ICard }) => {
        if (!socket) return;
        socket.emit(MAIN_NAMESPACE_EVENTS.CARD_DROPPED, { data: { card } });
      },
    },
    []
  );

  const cardNoRef =
    bidPoints?.length !== 4 ||
    !!usedCards.find((card) => card.playerId === player?.playerId);

  const isFlipCard = usedCards.length === 4;

  return (
    <div className="flex-1 h-full flex gap-1">
      <div className="w-full h-auto sm:h-full flex flex-col gap-1">
        <div className="w-full grow flex items-center justify-center p-2">
          {/* dropped cards board */}
          <div
            ref={cardNoRef ? null : drop}
            className={`w-full h-full md:w-3/4 lg:w-[650px] md:h-3/4 bg-zinc-800 rounded-lg flex items-center justify-center border-2
            ${
              isOver
                ? "border-blue-600 shadow-lg shadow-blue-500"
                : "border-zinc-700"
            }
            `}
          >
            {usedCards.length ? (
              <div className="inline-grid grid-cols-2 grid-rows-2 gap-2 items-center">
                {usedCards.map((card) => (
                  <FlipCard
                    key={card.cardId}
                    card={card}
                    isFlipCard={isFlipCard}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Drop your card here</p>
            )}
          </div>
        </div>
        {/* player unused cards */}
        <div className="w-full bg-zinc-800 h-40 sm:h-48">
          <div className="flex items-center h-full justify-center p-2 sm:p-0">
            <div className="inline-grid grid-cols-4 lg:grid-cols-8 grid-rows-1 sm:grid-rows-1 lg:grid-rows-1 gap-2 sm:gap-3">
              {cards
                .filter((card) => card.playerId === player?.playerId)
                .map((card) => (
                  <Card key={card.cardId} card={card} noRef={cardNoRef} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
