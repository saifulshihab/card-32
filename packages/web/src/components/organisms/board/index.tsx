import React from "react";
import styled from "styled-components";
import FlexContainer from "../../atoms/box/FlexContainer";
import { Card } from "../card";
import Chat from "../chat";

const MobileViewBoard = styled.div`
  height: calc(100% - 180px);
`;

const Board: React.FC = () => {
  return (
    <div className="w-full h-full flex gap-1">
      <div className="w-full h-auto sm:h-full flex flex-col gap-1">
        <div className="hidden w-full grow sm:flex items-center justify-center p-2">
          <div className="w-full h-full md:w-3/4 lg:w-2/4 md:h-3/4 bg-zinc-800 rounded-md flex items-center justify-center border-2 border-blue-500 shadow-md shadow-blue-500">
            <div className="inline-grid grid-cols-2 grid-rows-2 gap-2 items-center">
              <Card number={1} />
              <Card number={23} />
              <Card number={5} />
              <Card number={3} />
            </div>
          </div>
        </div>
        <MobileViewBoard className="block sm:hidden p-3">
          <div className="w-full h-full md:w-2/4 md:h-3/4 bg-zinc-800 rounded-md flex justify-center border-2 border-blue-500 shadow-md shadow-blue-500">
            <div className="inline-grid grid-cols-4 sm:grid-cols-2 grid-rows-1 sm:grid-rows-2 gap-2 items-center">
              <Card number={1} />
              <Card number={23} />
              <Card number={5} />
              <Card number={3} />
            </div>
          </div>
        </MobileViewBoard>
        <div className="w-full bg-zinc-800 h-40 sm:h-48">
          <FlexContainer className="h-full justify-center p-2 sm:p-0">
            <div className="inline-grid grid-cols-4 lg:grid-cols-8 grid-rows-1 sm:grid-rows-1 lg:grid-rows-1 gap-2 sm:gap-3">
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
      <div className="hidden sm:block">
        <Chat />
      </div>
    </div>
  );
};

export default Board;
