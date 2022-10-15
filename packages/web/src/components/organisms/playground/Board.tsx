import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { ICard } from "@card-32/common/types/card";
import { DNDType } from "@card-32/common/types/dnd";
import React from "react";
import { useDrop } from "react-dnd";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { useCardsContext } from "../../../contexts/CardsProvider";
import { useSocketContext } from "../../../contexts/SocketProvider";
import FlexContainer from "../../atoms/box/FlexContainer";
import { Card } from "./Card";

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
        socket.emit(MAIN_NAMESPACE_EVENTS.CARD_DROPPED, { card });
      },
    },
    []
  );

  const cardNoRef =
    bidPoints?.length !== 4 ||
    !!usedCards.find((card) => card.playerId === player?.playerId);

  return (
    <div className="flex-1 h-full flex gap-1">
      <div className="w-full h-auto sm:h-full flex flex-col gap-1">
        <div className="w-full grow flex items-center justify-center p-2">
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
            <div className="inline-grid grid-cols-2 grid-rows-2 gap-2 items-center">
              {usedCards.map((card) => (
                <Card key={card.cardId} card={card} />
              ))}
            </div>
          </div>
        </div>
        {/* bottom unused cards */}
        <div className="w-full bg-zinc-800 h-40 sm:h-48">
          <FlexContainer className="h-full justify-center p-2 sm:p-0">
            <div className="inline-grid grid-cols-4 lg:grid-cols-8 grid-rows-1 sm:grid-rows-1 lg:grid-rows-1 gap-2 sm:gap-3">
              {cards
                .filter((card) => card.playerId === player?.playerId)
                .map((card, idx) => (
                  <Card key={idx} card={card} noRef={cardNoRef} />
                ))}
            </div>
          </FlexContainer>
        </div>
      </div>
    </div>
  );
};

export default Board;
