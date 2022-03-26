import React from "react";
import FlexContainer from "../../atoms/box/FlexContainer";

interface IProps {
  number: number;
}

const Card: React.FC<IProps> = (props) => {
  const { number } = props;
  return (
    <div className="w-16 h-24 bg-white rounded shadow cursor-pointer">
      <FlexContainer className="h-full justify-center">
        <p className="text-3xl font-semibold text-gray-900">{number}</p>
      </FlexContainer>
    </div>
  );
};

export { Card };
