import { ICard } from "@card-32/common/types/card";
import { DNDType } from "@card-32/common/types/dnd";
import React, { PropsWithChildren } from "react";
import { useDrag } from "react-dnd";

interface IProps {
  card: ICard;
  hidden?: boolean;
  noRef?: boolean;
}

const Card: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { card, noRef } = props;
  const [{ isDragging }, dragRef] = useDrag(
    {
      type: DNDType.CARD,
      item: { card },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    },
    []
  );

  return (
    <div
      ref={noRef ? null : dragRef}
      draggable
      className={`w-10 h-16 sm:w-12 sm:h-20 bg-white rounded shadow cursor-pointer relative select-none card_animated
      ${isDragging ? "opacity-50" : "opacity-100"}
      `}
    >
      <div className="flex items-center h-full justify-center">
        <p className="text-xl sm:text-2xl font-semibold text-zinc-900">
          {card.value}
        </p>
      </div>
    </div>
  );
};

export { Card };
