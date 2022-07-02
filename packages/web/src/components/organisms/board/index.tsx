import React from "react";
import { useDrop } from "react-dnd";
import { ICard } from "../../../types/card";
import { DNDType } from "../../../types/dnd";
import FlexContainer from "../../atoms/box/FlexContainer";
import { Card } from "../card";
import Chat from "../chat";

const cards: ICard[] = [
  {
    id: "1",
    used: false,
    user: "shiahb",
    value: 5,
  },
  {
    id: "2",
    used: false,
    user: "shiahb",
    value: 15,
  },
  {
    id: "2",
    used: false,
    user: "shiahb",
    value: 8,
  },
];

const Board: React.FC = () => {
  const [{ isOver }, drop] = useDrop(
    {
      accept: DNDType.CARD,
      collect: (monitor) => {
        return {
          isOver: !!monitor.isOver(),
        };
      },
      // drop: ({ card }: { card: ICard }) => {
      //   console.log(card);
      // },
    },
    []
  );
  return (
    <div className="w-full h-full flex gap-1">
      <div className="w-full h-auto sm:h-full flex flex-col gap-1">
        <div className="w-full grow flex items-center justify-center p-2">
          <div
            ref={drop}
            className={`w-full h-full md:w-3/4 lg:w-2/4 md:h-3/4 bg-zinc-800 rounded-md flex items-center justify-center border-blue-500 shadow shadow-blue-600
            ${isOver ? "border-2 shadow-lg" : "border"}
            `}
          >
            <div className="inline-grid grid-cols-2 grid-rows-2 gap-2 items-center">
              {/* {cards.map((card, idx) => (
                <Card key={idx} card={card} />
              ))} */}
            </div>
          </div>
        </div>
        {/* bottom unused cards */}
        <div className="w-full bg-zinc-800 h-40 sm:h-48">
          <FlexContainer className="h-full justify-center p-2 sm:p-0">
            <div className="inline-grid grid-cols-4 lg:grid-cols-8 grid-rows-1 sm:grid-rows-1 lg:grid-rows-1 gap-2 sm:gap-3">
              {cards.map((card, idx) => (
                <Card key={idx} card={card} />
              ))}
            </div>
          </FlexContainer>
        </div>
      </div>
      <div className="hidden sm:block">
        <Chat />
      </div>
    </div>
  );
};

export default Board;
