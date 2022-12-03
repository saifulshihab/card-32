import { ICard } from "@card-32/common/types/card";
import { DNDType } from "@card-32/common/types/dnd";
import React, { PropsWithChildren } from "react";
import { useDrag } from "react-dnd";

interface IProps {
  card: ICard;
  hidden?: boolean;
  notDraggable?: boolean;
}

const Card: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { card, notDraggable } = props;
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
      ref={notDraggable ? undefined : dragRef}
      draggable
      className={`card w-10 h-16 sm:w-12 sm:h-20 bg-white rounded shadow cursor-pointer relative select-none card_animated
      ${isDragging ? "opacity-0" : "opacity-100"}
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
