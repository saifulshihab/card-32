import { ROOM_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToastMessage } from "../../components/atoms/toast";
import Board from "../../components/organisms/board";
import Chat from "../../components/organisms/chat";
import PlaygroundSidebar from "../../components/organisms/playground/PlaygroundSidebar";
import { useAuthContext } from "../../contexts/AuthProvider";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useSocketContext } from "../../contexts/SocketProvider";
import { LANDING } from "../../routes/routes";

const Playground: React.FC = () => {
  const navigate = useNavigate();
  const { room, setRoom } = useRoomContext();
  const { player } = useAuthContext();
  const { roomSocket } = useSocketContext();
  const [chatBoxVisible, setChatBoxVisible] = useState(false);

  useEffect(() => {
    // if no room or player object redirect to landing page
    if (!player || !room) {
      navigate(LANDING);
    }
  }, [player, room, navigate]);

  useEffect(() => {
    if (!roomSocket) return;

    // new player joined
    roomSocket.on(
      ROOM_NAMESPACE_EVENTS.NEW_PLAYER_JOINED,
      ({ message, room }) => {
        setRoom(room);
        showToastMessage({
          position: "bottom-left",
          message,
        });
      }
    );

    // player leave
    roomSocket.on(ROOM_NAMESPACE_EVENTS.LEAVE_ROOM, ({ message, room }) => {
      setRoom(room);
      showToastMessage({
        position: "bottom-left",
        message,
      });
    });

    // player disconnect
    roomSocket.on(
      ROOM_NAMESPACE_EVENTS.PLAYER_DISCONNECTED,
      ({ message, room }) => {
        setRoom(room);
        showToastMessage({
          position: "bottom-left",
          message,
        });
      }
    );

    return () => {
      roomSocket.off(ROOM_NAMESPACE_EVENTS.NEW_PLAYER_JOINED);
      roomSocket.off(ROOM_NAMESPACE_EVENTS.LEAVE_ROOM);
      roomSocket.off(ROOM_NAMESPACE_EVENTS.PLAYER_DISCONNECTED);
    };
  }, [roomSocket, setRoom]);

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row gap-1 relative">
      {/* left sidebar */}
      <PlaygroundSidebar />
      {/* board & chat */}
      <Board />
      <div className="hidden xl:block xl:w-[320px]">
        <Chat socket={roomSocket} />
      </div>
      <button
        className="absolute xl:hidden z-20 bottom-[23%] right-5 shadow-md sm:top-2 w-12 h-12 rounded-full btn-primary flex items-center justify-center
        bg-zinc-900 sm:bg-zinc-800 border-zinc-700
        "
        onClick={() => {
          setChatBoxVisible(!chatBoxVisible);
        }}
      >
        {chatBoxVisible ? (
          <i className="fa-solid fa-xmark"></i>
        ) : (
          <i className="fa-solid fa-message"></i>
        )}
      </button>

      {/* floating chat box */}
      <div
        className={`w-full border-2 rounded border-zinc-700 z-10 h-full sm:h-[90%] absolute sm:w-[320px] sm:right-16 sm:mt-14 ${
          chatBoxVisible ? "block" : "hidden"
        }`}
      >
        <Chat socket={roomSocket} />
      </div>
    </div>
  );
};

export default Playground;
