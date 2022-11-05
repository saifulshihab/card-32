import React from "react";
import SectionContainer from "../SectionContainer";
import { SectionHeading } from "../SectionHeading";

const VoiceChat: React.FC = () => {
  return (
    <SectionContainer>
      {/* left section */}
      <div className="flex-1 flex flex-col">
        <SectionHeading text="Voice chat" />
        <p className="text-gray-300">Coming soon.</p>
      </div>
    </SectionContainer>
  );
};

export default VoiceChat;
