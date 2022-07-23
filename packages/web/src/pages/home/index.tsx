import React from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import { ContentSubHeading } from "../../components/atoms/texts/ContentSubHeading";
import RoomCard from "../../components/organisms/home/RoomCard";
import { useRoomContext } from "../../contexts/RoomProvider";

const HomePage: React.FC = () => {
  const { activeRooms } = useRoomContext();
  return (
    <div>
      <FlexContainer className="justify-between items-center my-2">
        <ContentSubHeading>Active Rooms</ContentSubHeading>
        <button className="btn-primary bg-primary">Create Room</button>
      </FlexContainer>
      <hr className="border-zinc-700 my-3" />
      <div className="grid grid-cols-6 gap-3">
        {activeRooms.length ? (
          activeRooms.map((room, key) => <RoomCard key={key} room={room} />)
        ) : (
          <p className="text-sm text-gray-400">No rooms found!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
