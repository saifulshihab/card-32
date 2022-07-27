import React, { useState } from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import TextInput from "../../components/atoms/inputs/TextInput";
import Modal from "../../components/atoms/modal/Modal";
import { ContentSubHeading } from "../../components/atoms/texts/ContentSubHeading";
import { showToastMessage } from "../../components/atoms/toast";
import RoomCard from "../../components/organisms/home/RoomCard";
import { useRoomContext } from "../../contexts/RoomProvider";
import { getCapitalizedText } from "../../utils/string";

const HomePage: React.FC = () => {
  const { activeRooms } = useRoomContext();
  const [roomModal, setRoomModal] = useState<"create" | "join" | undefined>(
    undefined
  );
  const [roomName, setRoomName] = useState<string | undefined>(undefined);

  const onRoomCreate = () => {
    if (!roomName) {
      return showToastMessage({
        message: "Enter room name",
      });
    }
  };

  return (
    <div>
      <FlexContainer className="justify-between items-center my-2">
        <ContentSubHeading>Active Rooms</ContentSubHeading>
        <FlexContainer>
          <button
            className="btn-primary bg-primary"
            onClick={() => setRoomModal("create")}
          >
            Create Room
          </button>
          <button
            className="btn-primary border-2 border-primary"
            onClick={() => setRoomModal("join")}
          >
            Join Room
          </button>
        </FlexContainer>
      </FlexContainer>
      <hr className="border-zinc-700 my-3" />
      <div className="grid grid-cols-6 gap-3">
        {activeRooms.length ? (
          activeRooms.map((room, key) => <RoomCard key={key} room={room} />)
        ) : (
          <p className="text-sm text-gray-400">No rooms found!</p>
        )}
      </div>

      <Modal
        visible={roomModal !== undefined}
        onClose={() => setRoomModal(undefined)}
      >
        <div className="bg-zinc-800 p-4 py-5 text-white">
          <ContentSubHeading>
            {getCapitalizedText(roomModal as string)} Room
          </ContentSubHeading>
          <p className="text-xs">
            {roomModal === "create"
              ? "Create room and play with other's"
              : "Join a room"}
          </p>
          <FlexContainer className="mt-3">
            <TextInput
              placeholder="Enter room name"
              className="border-b border-primary"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <button className="btn-primary bg-primary" onClick={onRoomCreate}>
              {roomModal === "create" ? "Create" : "Join"}
            </button>
          </FlexContainer>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
