import React from "react";
import FlexContainer from "../../../components/atoms/box/FlexContainer";
import { Card } from "../../../components/organisms/card";

const Board: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col gap-1">
      <div className="w-full grow rounded py-20 px-96">
        <div className="w-full h-full bg-gray-800 rounded-md flex flex-col items-center justify-center border-2 border-blue-500 shadow-md shadow-blue-500">
          <div className="inline-grid grid-cols-2 grid-rows-2 gap-2">
            <Card number={1} />
            <Card number={23} />
            <Card number={5} />
            <Card number={3} />
          </div>
          {/* <Button className="mt-5 border-orange-500 shadow-orange-600">
            Pass
          </Button> */}
        </div>
      </div>
      <div className="w-full bg-gray-800 h-48">
        <FlexContainer className="h-full justify-center">
          <div className="inline-grid grid-cols-8 grid-rows-1 gap-3">
            <Card number={19} />
            <Card number={2} />
            <Card number={6} />
            <Card number={31} />
            <Card number={23} />
            <Card number={10} />
            <Card number={2} />
            <Card number={5} />
          </div>
        </FlexContainer>
      </div>
    </div>
  );
};

export default Board;
