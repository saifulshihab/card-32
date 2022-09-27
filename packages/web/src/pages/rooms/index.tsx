import React, { useState } from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import Chat from "../../components/organisms/chat";
import CreateOrJoinRoomModal from "../../components/organisms/landing/CreateOrJoinRoomModal";
import RoomCard from "../../components/organisms/rooms/RoomCard";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useSocketContext } from "../../contexts/SocketProvider";

const Rooms: React.FC = () => {
  const { activeRooms } = useRoomContext();
  const { isSocketConnected, mainSocket } = useSocketContext();
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

        <div className="py-8">
          <div className="flex gap-3">
            <div className="flex-1">
              {!activeRooms.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeRooms.map((room) => (
                    <RoomCard key={room.roomId} room={room} />
                  ))}
                  {Array(20)
                    .fill(0)
                    .map((_, idx) => (
                      <RoomCard
                        key={idx}
                        room={{
                          roomId: `9ight${idx}`,
                          creator: { playerId: "1", username: "shihab" },
                          players: [
                            { playerId: "1", username: "shihab" },
                            { playerId: "1", username: "shihab" },
                            { playerId: "1", username: "shihab" },
                          ],
                        }}
                      />
                    ))}
                </div>
              ) : (
                <p className="text-gray-300 text-sm">No active rooms!</p>
              )}
            </div>
            {/* chat */}
            <div className="hidden lg:block lg:w-[250px] xl:w-[320px]  h-[calc(100vh-180px)]">
              <Chat socket={mainSocket} />
            </div>
          </div>
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
