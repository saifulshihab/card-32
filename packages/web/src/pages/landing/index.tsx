import React from "react";
import RoomChat from "../../components/organisms/landing/features/RoomChat";
import VoiceChat from "../../components/organisms/landing/features/VoiceChat";
import Footer from "../../components/organisms/landing/footer";
import GamePlay from "../../components/organisms/landing/gameplay";
import Header from "../../components/organisms/landing/header";
import HeroSection from "../../components/organisms/landing/hero";

const LandingPage: React.FC = () => {
  return (
    <main className="w-full min-h-screen">
      {/* header */}
      <Header />
      {/* hero section */}
      <HeroSection />
      {/* gameplay section */}
      <GamePlay />
      {/* features */}
      <RoomChat />
      <VoiceChat />
      {/* footer */}
      <Footer />
    </main>
  );
};

export default LandingPage;
