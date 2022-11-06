import React from "react";
import SectionContainer from "../SectionContainer";
import { SectionHeading } from "../SectionHeading";

const RoomChat: React.FC = () => {
  return (
    <SectionContainer>
      {/* left section */}
      <div className="flex-1 flex flex-col">
        <SectionHeading text="Chat" />
        <p className="text-gray-300">Room and global chat system available.</p>
      </div>
      <div className="flex-1 p-2 relative rounded-md bg-zinc-800 h-max">
        <div className="z-10 relative">
          <img
            className="rounded-md"
            src="/assets/images/room_chat.png"
            alt="card drop on board"
          />
        </div>
        <div className="absolute inset-0 bg-zinc-800 rounded-md blur" />
      </div>
    </SectionContainer>
  );
};

export default RoomChat;
