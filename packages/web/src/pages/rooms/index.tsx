import { ROOM_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import {
  IRoomCreateOrJoinResponse,
  TRoomJoinRequestStatus,
} from "@card-32/common/types/room";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import TextInput from "../../components/atoms/inputs/TextInput";
import Modal from "../../components/atoms/modal/Modal";
import { showToastMessage } from "../../components/atoms/toast";
import Chat from "../../components/organisms/chat";
import CreateOrJoinRoomModal from "../../components/organisms/landing/CreateOrJoinRoomModal";
import RoomCard from "../../components/organisms/rooms/RoomCard";
import { useAuthContext } from "../../contexts/AuthProvider";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useSocketContext } from "../../contexts/SocketProvider";
import { PLAYGROUND } from "../../routes/routes";
import { usernameValidatorSchema } from "../../validators/playerValidators";

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const { setPlayer } = useAuthContext();
  const { activeRooms, setRoom } = useRoomContext();
  const { isSocketConnected, mainSocket, roomSocket } = useSocketContext();
  const [createOrJoinRoomModalVisible, setCreateOrJoinRoomModalVisible] =
    useState(false);
  const [joinRequestSent, setJoinRequestSent] = useState(false);

  const [joinRequestInput, setJoinRequestInput] = useState<
    | {
        roomId?: string;
        roomCreatorId?: string;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (!roomSocket) return;
    // join request response
    roomSocket.on(
      ROOM_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE,
      (result: {
        status: TRoomJoinRequestStatus;
        data: IRoomCreateOrJoinResponse;
      }) => {
        const { status, data: joinRequestResponse } = result;
        if (status === "rejected") {
          showToastMessage({ type: "error", message: "Request rejected." });
        } else if (status === "accepted") {
          roomSocket.emit(
            ROOM_NAMESPACE_EVENTS.JOIN_REQUEST_ACCEPTED,
            { data: joinRequestResponse },
            (result: { error?: string; data?: { message: string } }) => {
              const { error, data } = result;
              if (error) {
                showToastMessage({ type: "error", message: error });
                return;
              }
              if (data) {
                setPlayer(joinRequestResponse.player);
                setRoom(joinRequestResponse.room);
                navigate(PLAYGROUND(joinRequestResponse.room.roomId));
                showToastMessage({ type: "success", message: data.message });
              }
            }
          );
        }
      }
    );

    return () => {
      roomSocket.off(ROOM_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE);
    };
  }, [roomSocket, navigate, setPlayer, setRoom]);

  useEffect(() => {
    if (joinRequestSent) {
      setTimeout(() => {
        setJoinRequestSent(false);
      }, 3000);
    }
  }, [joinRequestSent]);

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

  const sendJoinRequest = (username: string, cb?: () => void) => {
    if (!roomSocket) return;
    if (!joinRequestInput) return;
    roomSocket.emit(
      ROOM_NAMESPACE_EVENTS.JOIN_REQUEST,
      {
        socketId: roomSocket.id,
        username,
        ...joinRequestInput,
      },
      (response: { error?: string; data?: { message: string } }) => {
        const { error, data } = response;
        if (error) {
          showToastMessage({ type: "error", message: error });
          return;
        }
        if (!data) return;
        setJoinRequestSent(true);
        setJoinRequestInput(undefined);
        cb && cb();
      }
    );
  };

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

      {/* join request modal */}
      <Modal
        visible={!!joinRequestInput || joinRequestSent}
        onClose={() => {
          setJoinRequestInput(undefined), setJoinRequestSent(false);
        }}
      >
        {joinRequestSent ? (
          <p className="text-sm">
            Please wait, the room creator will let you in soon.
          </p>
        ) : joinRequestInput ? (
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
        ) : null}
      </Modal>
    </div>
  );
};

export default Rooms;
