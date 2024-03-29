import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { ICard } from "@card-32/common/types/card";
import { DNDType } from "@card-32/common/types/dnd";
import React from "react";
import { useDrop } from "react-dnd";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { useCardsContext } from "../../../contexts/CardsProvider";
import { useRoomContext } from "../../../contexts/RoomProvider";
import { useSocketContext } from "../../../contexts/SocketProvider";
import FlexContainer from "../../atoms/box/FlexContainer";
import { Card } from "./card/Card";
import { FlipCard } from "./card/FlipCard";
import { PlayerCard } from "./PlayerCard";

const Board: React.FC = () => {
  const { player } = useAuthContext();
  const { socket } = useSocketContext();
  const { isRoomFull } = useRoomContext();
  const { cards, usedCards, isBidDone, leaderboard } = useCardsContext();
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

  const notDroppable =
    !isBidDone ||
    !!usedCards.find((card) => card.playerId === player?.playerId);

  const isFlipCard = usedCards.length === 4;

  return (
    <div className="flex-1 h-full flex gap-1">
      <div className="w-full h-auto sm:h-full flex flex-col gap-1">
        <div className="w-full grow flex items-center justify-center p-2">
          {/* dropped cards board */}
          <div
            ref={notDroppable ? null : drop}
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
            ) : isBidDone ? (
              leaderboard.length && !cards.length ? (
                <FlexContainer className="flex-col gap-5 card_animated">
                  <p className="text-5xl">🏆</p>
                  <PlayerCard
                    username={leaderboard[0].username}
                    bidPoint={{
                      bid: leaderboard[0].bid,
                      point: leaderboard[0].point,
                    }}
                    isCardServed
                  />
                  <p className="text-3xl font-bold mt-2">Winner</p>
                </FlexContainer>
              ) : (
                <p className="text-xs text-gray-500 font-semibold">
                  Drop your card here
                </p>
              )
            ) : (
              <p className="text-xs font-semibold">
                <span className="text-rose-500 ">
                  Can&apos;t drop,{" "}
                  {!isRoomFull
                    ? "Room is not full"
                    : "bid is not completed yet"}
                </span>
              </p>
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
                  <Card key={card.cardId} card={card} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
