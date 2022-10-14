import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { TGenericMessage } from "@card-32/common/types/player";
import {
  IRoomJoinRequestInput,
  TRoomJoinRequestStatus,
} from "@card-32/common/types/room";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/atoms/modal/Modal";
import Board from "../../components/organisms/board";
import Chat from "../../components/organisms/chat";
import PlaygroundSidebar from "../../components/organisms/playground/PlaygroundSidebar";
import { useAuthContext } from "../../contexts/AuthProvider";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useSocketContext } from "../../contexts/SocketProvider";
import { HOME } from "../../routes/routes";
import { removeDataOnLocalStorage } from "../../utils/localStorage";

const Playground: React.FC = () => {
  const navigate = useNavigate();
  const { player, roomId } = useAuthContext();
  const { setRoom } = useRoomContext();
  const { socket } = useSocketContext();
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [messages, setMessages] = useState<TGenericMessage[]>([]);
  const [newJoinRequest, setNewJoinRequest] = useState<
    IRoomJoinRequestInput | undefined
  >(undefined);

  useEffect(() => {
    if (!player || !roomId) {
      navigate(HOME);
    }
  }, [player, roomId, navigate]);

  useEffect(() => {
    if (!socket) return;

    // new player joined
    socket.on(MAIN_NAMESPACE_EVENTS.NEW_PLAYER_JOINED, ({ message, room }) => {
      setRoom(room);
      toast.success(message, {
        position: "bottom-left",
      });
    });

    // new room join request
    socket.on(
      MAIN_NAMESPACE_EVENTS.JOIN_REQUEST,
      (data: IRoomJoinRequestInput) => {
        setNewJoinRequest(data);
      }
    );

    // player leave
    socket.on(MAIN_NAMESPACE_EVENTS.LEAVE_ROOM, ({ message, room }) => {
      setRoom(room);
      toast(message, {
        position: "bottom-left",
        icon: "⬅️",
      });
    });

    // player disconnect
    socket.on(
      MAIN_NAMESPACE_EVENTS.PLAYER_DISCONNECTED,
      ({ message, room }) => {
        setRoom(room);
        toast(message, {
          position: "bottom-left",
          icon: "⬅️",
        });
      }
    );

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.NEW_PLAYER_JOINED);
      socket.off(MAIN_NAMESPACE_EVENTS.LEAVE_ROOM);
      socket.off(MAIN_NAMESPACE_EVENTS.PLAYER_DISCONNECTED);
      socket.off(MAIN_NAMESPACE_EVENTS.JOIN_REQUEST);
    };
  }, [socket, setRoom]);

  useEffect(() => {
    // close request modal after 10 second
    if (!newJoinRequest) return;
    const timeout = setTimeout(() => {
      setNewJoinRequest(undefined);
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, [newJoinRequest]);

  useEffect(() => {
    // remove localstorage data on window close or page refresh
    window.onbeforeunload = () => {
      removeDataOnLocalStorage();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      MAIN_NAMESPACE_EVENTS.NEW_MESSAGE,
      ({ data }: { data: TGenericMessage }) => {
        setMessages((prev) => [...prev, data]);
      }
    );

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.NEW_MESSAGE);
    };
  }, [socket]);

  const handleSendMessage = (message: string, callback?: () => void) => {
    if (!socket) return;
    if (!message) return;
    socket.emit(MAIN_NAMESPACE_EVENTS.SEND_MESSAGE, {
      message,
      username: player?.username,
    });
    callback && callback();
  };

  const sendJoinRequestResponse = (status: TRoomJoinRequestStatus) => {
    if (!socket) return;
    socket.emit(MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE, {
      status,
      joinRequest: newJoinRequest,
    });
    setNewJoinRequest(undefined);
  };

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row gap-1 relative">
      {/* left sidebar */}
      <PlaygroundSidebar />
      {/* board & chat */}
      <Board />
      <div className="hidden xl:block xl:w-[320px]">
        <Chat messages={messages} handleSendMessage={handleSendMessage} />
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
        <Chat messages={messages} handleSendMessage={handleSendMessage} />
      </div>

      {/* join request accept/reject modal */}
      <Modal
        visible={!!newJoinRequest}
        onClose={() => setNewJoinRequest(undefined)}
      >
        <div className="flex flex-col gap-8 items-center">
          {newJoinRequest?.username ? (
            <p className="text-xl font-bold">
              <span className="text-primary">{newJoinRequest?.username}</span>{" "}
              wants to join.
            </p>
          ) : null}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 items-center">
              <button
                className="btn-primary rounded-full bg-lime-500 w-10 h-10 flex items-center justify-center"
                onClick={() => sendJoinRequestResponse("accepted")}
              >
                <i className="fa-solid fa-check"></i>
              </button>
              <p className="text-xs">Accept</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <button
                className="btn-primary rounded-full bg-red-500 w-10 h-10 flex items-center justify-center"
                onClick={() => sendJoinRequestResponse("rejected")}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <p className="text-xs">Reject</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Playground;
