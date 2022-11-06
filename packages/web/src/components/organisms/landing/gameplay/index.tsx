import React from "react";
import SectionContainer from "../SectionContainer";
import { SectionHeading } from "../SectionHeading";

const GamePlay: React.FC = () => {
  return (
    <SectionContainer id="gameplay">
      {/* left section */}
      <div className="flex-1 flex flex-col">
        <SectionHeading text="Gameplay" />
        <p className="text-gray-300">
          Card 32 is a multiplayer card game where a player can join/create a
          room with a room id and username. A maximum of 4 players can join a
          room. At the start of the game, randomly 8 cards will be passed to
          each player (total of 32 cards with values 1-32). The player can bid
          an estimated winning point based on the cards received. Then in each
          round, each player gets to drop a card and the highest numbered card
          wins that round. 8 rounds in total.
        </p>
      </div>
    </SectionContainer>
  );
};

export default GamePlay;
