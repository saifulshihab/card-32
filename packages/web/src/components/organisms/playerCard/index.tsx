import React from "react";
import FlexContainer from "../../atoms/box/FlexContainer";

interface IProps {
  name: string;
}

const PlayerCard: React.FC<IProps> = (props) => {
  const { name } = props;
  return (
    <div className="relative w-14 h-24 sm:w-20 sm:h-32 rounded-md shadow bg-zinc-700">
      <FlexContainer className="flex-col gap-1 justify-center p-1 sm:p-2 pt-1 sm:pt-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow">
          <img
            src="https://picsum.photos/200"
            alt="player"
            className="w-full h-full rounded-full"
          />
        </div>
        <p className="text-sm">{name}</p>
      </FlexContainer>
      <div className="absolute bottom-0 w-full bg-zinc-900 rounded-md rounded-tl-none rounded-tr-none text-xs">
        <FlexContainer>
          <p className="bg-yellow-700 flex-1 text-center">Bid</p>
          <p className="text-center flex-1 font-semibold">0</p>
        </FlexContainer>
        <FlexContainer>
          <p className="bg-purple-700 flex-1 text-center rounded-bl-md">
            Point
          </p>
          <p className="text-center flex-1 font-semibold">0</p>
        </FlexContainer>
      </div>
    </div>
  );
};

export { PlayerCard };
