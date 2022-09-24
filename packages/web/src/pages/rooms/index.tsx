import React, { useState } from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import CreateOrJoinRoomModal from "../../components/organisms/landing/CreateOrJoinRoomModal";
import { useSocketContext } from "../../contexts/SocketProvider";

const Rooms: React.FC = () => {
  const { isSocketConnected } = useSocketContext();
  const [createOrJoinRoomModalVisible, setCreateOrJoinRoomModalVisible] =
    useState(false);
  return (
    <div className="w-full h-full">
      <div className="w-full h-6 shadow-md bg-zinc-800 flex items-center">
        <div className="container m-auto flex items-center justify-end gap-2 text-xs font-bold px-5 select-none">
          <p>Server status</p>
          <div className="flex items-center gap-1.5">
            <div
              className={`inline-block relative h-2 w-2 rounded-full shadow ${
                isSocketConnected ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <span
                className={`${
                  !isSocketConnected ? "hidden" : ""
                }absolute h-2 w-2 rounded-full animate-ping bg-green-600 opacity-75`}
              />
            </div>
            <p
              className={`${
                isSocketConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {isSocketConnected ? "Running" : "Stopped"}
            </p>
          </div>
        </div>
      </div>

      <div className="container m-auto mt-10 px-5">
        <FlexContainer className="justify-between items-center pb-2 border-b-2 border-zinc-800 select-none">
          <h1 className="text-xl font-bold">Active Rooms</h1>
          <FlexContainer className="gap-2">
            <button
              className="btn-primary bg-primary"
              onClick={() => setCreateOrJoinRoomModalVisible(true)}
            >
              Create/Join Room
            </button>
          </FlexContainer>
        </FlexContainer>

        <div className="my-8">
          <p className="text-sm text-gray-400">Feature coming soon...</p>
        </div>
      </div>

      {/* join/create room modal */}
      <CreateOrJoinRoomModal
        visible={createOrJoinRoomModalVisible}
        onClose={() => setCreateOrJoinRoomModalVisible(false)}
      />
    </div>
  );
};

export default Rooms;
