import React, { PropsWithChildren } from "react";
import { useDrag } from "react-dnd";
import FlexContainer from "../../atoms/box/FlexContainer";
import { DNDType } from "../../../types/dnd";
import { ICard } from "../../../types/card";

interface IProps {
  card: ICard;
  hidden?: boolean;
}

const Card: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { card } = props;
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
      ref={!card.used ? dragRef : null}
      draggable
      // style={{
      //   opacity: isDragging ? 0.2 : 1,
      // }}
      className={`w-10 h-16 sm:w-14 sm:h-20 bg-white rounded-md shadow cursor-pointer relative
      ${isDragging ? "hidden" : "block"}
      `}
    >
      <FlexContainer className="h-full justify-center">
        <p className="text-xl sm:text-3xl font-semibold text-zinc-900">
          {card.value}
        </p>
      </FlexContainer>
    </div>
  );
};

export { Card };
