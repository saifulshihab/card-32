import React from "react";
import FlexContainer from "../../atoms/box/FlexContainer";

interface IProps {
  username: string;
  bidPoint: {
    bid: number;
    point: number;
  };
  isCardServed?: boolean;
}

const PlayerCard: React.FC<IProps> = (props) => {
  const { username, bidPoint, isCardServed } = props;
  const isPlayerBidSuccess = bidPoint.point >= bidPoint.bid;
  return (
    <div
      className={`relative w-14 h-24 sm:w-20 sm:h-32 rounded-md shadow bg-zinc-700 card_animated ${
        isCardServed !== undefined
          ? isCardServed
            ? "shadow-lg shadow-green-400"
            : "shadow-lg shadow-orange-600"
          : ""
      }`}
    >
      <FlexContainer className="flex-col gap-1 justify-center p-1 sm:p-2 pt-1 sm:pt-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow">
          <img
            src="https://random.imagecdn.app/100/100"
            alt="player"
            className="w-full h-full rounded-full"
          />
        </div>
        <p className="text-sm">{username}</p>
      </FlexContainer>
      <div className="absolute bottom-0 w-full bg-zinc-900 rounded-md rounded-tl-none rounded-tr-none text-xs">
        <FlexContainer>
          <p className="bg-yellow-700 flex-1 text-center">Bid</p>
          <p className="text-center flex-1 font-semibold">{bidPoint.bid}</p>
        </FlexContainer>
        <FlexContainer>
          <p className="bg-purple-700 flex-1 text-center rounded-bl-md">
            Point
          </p>
          <p
            className={`text-center flex-1 font-semibold ${
              isPlayerBidSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {bidPoint.point}
          </p>
        </FlexContainer>
      </div>
    </div>
  );
};

export { PlayerCard };
