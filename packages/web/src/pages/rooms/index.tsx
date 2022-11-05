import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { TGenericMessage } from "@card-32/common/types/player";
import {
  IRoomCreateIOrJoinInput,
  IRoomCreateOrJoinResponse,
  TRoomJoinRequestStatus,
} from "@card-32/common/types/room";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import AnimatedCircle from "../../components/atoms/box/AnimatedCircle";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import TextInput from "../../components/atoms/inputs/TextInput";
import Modal from "../../components/atoms/modal/Modal";
import Chat from "../../components/organisms/chat";
import CreateOrJoinRoomModal from "../../components/organisms/rooms/CreateOrJoinRoomModal";
import RoomCard from "../../components/organisms/rooms/RoomCard";
import { useAuthContext } from "../../contexts/AuthProvider";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useSocketContext } from "../../contexts/SocketProvider";
import { LANDING, PLAYGROUND } from "../../routes/routes";
import { setPlayerAndRoomIdOnLocalStorage } from "../../utils/localStorage";
import { usernameValidatorSchema } from "../../validators/playerValidators";

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const { player, setPlayer, roomId, setRoomId } = useAuthContext();
  const { activeRooms, setRoom } = useRoomContext();
  const { isSocketConnected, socket } = useSocketContext();
  const [createOrJoinRoomModalVisible, setCreateOrJoinRoomModalVisible] =
    useState(false);
  const [joinRequestInput, setJoinRequestInput] = useState<
    | {
        roomId?: string;
        roomCreatorId?: string;
      }
    | undefined
  >(undefined);
  const [messages, setMessages] = useState<TGenericMessage[]>([]);

  useEffect(() => {
    if (!socket) return;

    // join request response
    socket.on(
      MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE,
      (result: {
        status: TRoomJoinRequestStatus;
        data: IRoomCreateOrJoinResponse;
      }) => {
        const { status, data: joinRequestResponse } = result;
        if (status === "rejected") {
          toast.error("Request rejected.");
        } else if (status === "accepted") {
          socket.emit(
            MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_ACCEPTED,
            { data: joinRequestResponse },
            (result: { error?: string; data?: { message: string } }) => {
              const { error, data } = result;
              if (error) {
                toast.error(error);
                return;
              }
              if (data) {
                setPlayer(joinRequestResponse.player);
                setRoomId(joinRequestResponse.room.roomId);
                setRoom(joinRequestResponse.room);
                navigate(PLAYGROUND);
                toast.success(data.message);
              }
            }
          );
        }
      }
    );

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE);
    };
  }, [socket, navigate, setPlayer, setRoomId, setRoom]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      MAIN_NAMESPACE_EVENTS.GLOBAL_NEW_MESSAGE,
      ({ data }: { data: TGenericMessage }) => {
        setMessages((prev) => [...prev, data]);
      }
    );

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.GLOBAL_NEW_MESSAGE);
    };
  }, [socket]);

  const handleSendMessage = (message: string, callback?: () => void) => {
    if (!socket) return;
    if (!message) return;
    socket.emit(MAIN_NAMESPACE_EVENTS.GLOBAL_SEND_MESSAGE, {
      message,
    });
    callback && callback();
  };

  const handleCreateOrJoinRoom = (
    joinInput: IRoomCreateIOrJoinInput,
    callback?: () => void
  ) => {
    if (!socket) return;
    if (player && roomId) {
      return toast.error("You are already in a room.");
    }
    socket.emit(
      MAIN_NAMESPACE_EVENTS.JOIN_ROOM,
      joinInput,
      (response: { error?: string; data?: IRoomCreateOrJoinResponse }) => {
        const { error, data } = response;
        if (error) {
          toast.error(error);
          return;
        }

        if (!data) return;
        const player = {
          username: joinInput.username,
          playerId: data.player.playerId,
        };

        setPlayerAndRoomIdOnLocalStorage({
          player,
          roomId: data.room.roomId,
        });
        setPlayer(player);
        setRoomId(data.room.roomId);
        setRoom(data.room);
        navigate(PLAYGROUND);
        callback && callback();
      }
    );
  };

  const sendJoinRequest = (username: string, cb?: () => void) => {
    if (!socket) return;
    if (!joinRequestInput) return;

    socket.emit(
      MAIN_NAMESPACE_EVENTS.JOIN_REQUEST,
      {
        socketId: socket.id,
        username,
        ...joinRequestInput,
      },
      (response: { error?: string; data?: { message: string } }) => {
        const { error, data } = response;
        if (error) {
          toast.error(error);
          return;
        }
        if (!data) return;
        setJoinRequestInput(undefined);
        cb && cb();
        toast.success("Please wait, the room creator will let you in soon.");
      }
    );
  };

  const handleJoinRequestInputChange = (name: any, value: any) => {
    setJoinRequestInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onRoomJoinClick = (roomId: string, roomCreatorId: string) => {
    handleJoinRequestInputChange("roomId", roomId);
    handleJoinRequestInputChange("roomCreatorId", roomCreatorId);
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-6 shadow-md bg-zinc-800 flex items-center">
        <div className="container m-auto flex items-center justify-between text-xs font-bold select-none  px-5">
          <NavLink to={LANDING}>
          <p>Home</p>
          </NavLink>
          <div className="flex items-center gap-2">
            <p>Server status</p>
            <div className="flex items-center gap-1.5">
              <AnimatedCircle socketConnected={isSocketConnected} />
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
              {activeRooms.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeRooms.map((room) => (
                    <RoomCard
                      key={room.roomId}
                      room={room}
                      onClick={onRoomJoinClick}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 text-sm">No active rooms!</p>
              )}
            </div>
            {/* chat */}
            <div className="hidden lg:block lg:w-[250px] xl:w-[320px]  h-[calc(100vh-180px)]">
              <Chat
                isGlobal
                messages={messages}
                handleSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* join/create room modal */}
      <CreateOrJoinRoomModal
        visible={createOrJoinRoomModalVisible}
        onClose={() => setCreateOrJoinRoomModalVisible(false)}
        onSubmit={handleCreateOrJoinRoom}
      />

      {/* join request modal */}
      <Modal
        visible={!!joinRequestInput}
        onClose={() => {
          setJoinRequestInput(undefined);
        }}
      >
        <Formik
          initialValues={{
            username: "",
          }}
          validationSchema={usernameValidatorSchema}
          onSubmit={(values, { resetForm }) =>
            sendJoinRequest(values.username, () => resetForm())
          }
        >
          {({ values, handleChange }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold">Room ID</label>
                <p className="text-xs">{joinRequestInput?.roomId}</p>
              </div>

              <TextInput
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Send request
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Rooms;
