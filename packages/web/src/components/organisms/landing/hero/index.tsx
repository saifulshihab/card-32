import React from "react";
import { useNavigate } from "react-router-dom";
import { ROOMS } from "../../../../routes/routes";
import SectionContainer from "../SectionContainer";
import styles from "./Hero.module.css";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const onPlayNow = () => {
    navigate(ROOMS);
  };

  return (
    <SectionContainer>
      {/* hero left section */}
      <div className="flex-1 flex flex-col items-center md:items-start">
        <h1
          className={`text-4xl text-center md:text-left sm:text-7xl font-extrabold gradient_text ${styles.hero_text}`}
        >
          A multiplayer card game. Create a room <br />
          and start playing
        </h1>

        <button
          className={`mt-16 md:ml-5 btn-primary h-14 w-40 text-lg ${styles.playNow_btn}`}
          onClick={onPlayNow}
        >
          Play now
        </button>
      </div>
      {/* hero right section */}
      <div className="flex-1 p-2 relative h-max">
        <div className="z-10 relative">
          <img
            className="rounded-md"
            src="/assets/images/card_dropped.png"
            alt="card drop on board"
          />
        </div>
        <div className="absolute inset-0 bg-zinc-800 rounded-md blur bg-gradient-to-r from-purple-700 via-pink-700 to-blue-700 animate-pulse" />
      </div>
    </SectionContainer>
  );
};

export default HeroSection;
