import React, { useState } from "react";
import CreateOrJoinRoomModal from "../../components/organisms/landing/CreateOrJoinRoomModal";
import { useSocketContext } from "../../contexts/SocketProvider";

const LandingPage: React.FC = () => {
  const [createOrJoinRoomModalVisible, setCreateOrJoinRoomModalVisible] =
    useState(false);
  const { isSocketConnected } = useSocketContext();

  return (
    <div className="container mx-auto">
      <div className="w-full  relative min-h-screen">
        <div className="py-24 px-5">
          <h1 className="text-primary text-7xl font-extrabold">Card-32</h1>
          <p className="text-gray-200 text-sm mt-2 ml-2">
            A simple card game. Create room with <br /> a room ID and username
            and invite others to play.
          </p>
          <button
            className="mt-12 btn-primary h-14 w-32 bg-rose-600 text-lg"
            onClick={() => setCreateOrJoinRoomModalVisible(true)}
          >
            Play Now!
          </button>
        </div>

        <div className="absolute bottom-0 px-5 pb-5">
          <div className="flex items-center gap-2 text-sm font-bold">
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

        {/* join/create room modal */}
        <CreateOrJoinRoomModal
          visible={createOrJoinRoomModalVisible}
          onClose={() => setCreateOrJoinRoomModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default LandingPage;
