import React from "react";
import FlexContainer from "../../atoms/box/FlexContainer";

interface IProps {
  number: number;
}

const Card: React.FC<IProps> = (props) => {
  const { number } = props;
  return (
    <div className="w-10 h-16 sm:w-14 sm:h-20 bg-white rounded-md shadow cursor-pointer relative">
      <FlexContainer className="h-full justify-center">
        <p className="text-xl sm:text-3xl font-semibold text-zinc-900">
          {number}
        </p>
      </FlexContainer>
    </div>
  );
};

export { Card };
