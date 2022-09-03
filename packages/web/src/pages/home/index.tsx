import { IRoomCreateInput } from "@card-32/common/types/room";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handlePublicApiError, ICommonApiError } from "../../api/apiRequest";
import { joinRoomApi, roomCreateApi } from "../../api/roomApi";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import Button from "../../components/atoms/button/Button";
import TextInput from "../../components/atoms/inputs/TextInput";
import Modal from "../../components/atoms/modal/Modal";
import { ContentSubHeading } from "../../components/atoms/texts/ContentSubHeading";
import { showToastMessage } from "../../components/atoms/toast";
import RoomCard from "../../components/organisms/home/RoomCard";
import { useAuthContext } from "../../contexts/AuthProvider";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useSocketContext } from "../../contexts/SocketProvider";
import { PLAYGROUND } from "../../routes/routes";
import { roomCreateValidator } from "../../validators/roomValidators";

const initialFormErrors: IRoomCreateInput = {
  roomId: undefined,
  password: undefined,
};

const initialInput: IRoomCreateInput = {
  roomId: undefined,
  password: undefined,
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { mainSocket } = useSocketContext();
  const { user } = useAuthContext();
  const { activeRooms, setRoom } = useRoomContext();
  const [roomModal, setRoomModal] = useState<"create" | "join" | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [roomInput, setRoomInput] = useState<IRoomCreateInput>(initialInput);
  const [formErrors, setFormErrors] = useState<typeof initialFormErrors | null>(
    null
  );

  const playerRoom = activeRooms.find(
    (room) =>
      room.creator === user?._id ||
      room.players.map((p) => p.playerId).includes(user?._id as string)
  );

  const onChangeRoomInput = (key: keyof IRoomCreateInput, value: string) => {
    setRoomInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onRoomCreate = async () => {
    setFormErrors(null);
    const { isValid, errors } = await roomCreateValidator(roomInput);

    if (isValid) {
      try {
        setLoading(true);
        const { data } = await roomCreateApi(roomInput);
        setRoomInput(initialInput);
        setRoomModal(undefined);
        setRoom(data);
        navigate(PLAYGROUND(data.roomId));
      } catch (err) {
        const { error, data } = handlePublicApiError(err as ICommonApiError);
        showToastMessage({
          message: error || data?.message || "Something went wrong",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  const onJoinRoom = async () => {
    setFormErrors(null);
    const { isValid, errors } = await roomCreateValidator(roomInput);
    if (isValid) {
      try {
        setLoading(true);
        const { data } = await joinRoomApi(roomInput);
        setRoomInput(initialInput);
        setRoomModal(undefined);
        setRoom(data);
        navigate(PLAYGROUND(data.roomId));
      } catch (err) {
        const { error, data } = handlePublicApiError(err as ICommonApiError);
        showToastMessage({
          message: error || data?.message || "Something went wrong",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  if (!mainSocket?.active) {
    return <p className="">Connecting...</p>;
  }

  return (
    <>
      <FlexContainer className="justify-between items-center my-2">
        <ContentSubHeading>Active Rooms</ContentSubHeading>
        <FlexContainer>
          {playerRoom ? (
            <Button
              className="bg-primary"
              onClick={() => navigate(PLAYGROUND(playerRoom.roomId))}
            >
              My room
            </Button>
          ) : (
            <>
              <Button
                className="bg-primary"
                onClick={() => setRoomModal("create")}
              >
                Create Room
              </Button>
              <Button
                className="border-2 border-primary"
                onClick={() => setRoomModal("join")}
              >
                Join Room
              </Button>
            </>
          )}
        </FlexContainer>
      </FlexContainer>

      <hr className="border-zinc-700 my-3" />
      <div className="grid grid-cols-4 gap-4">
        {activeRooms.length ? (
          activeRooms.map((room, key) => <RoomCard key={key} room={room} />)
        ) : (
          <p className="text-sm text-gray-400">No rooms available!</p>
        )}
      </div>

      {/* create room modal */}
      <Modal
        visible={roomModal === "create"}
        onClose={() => setRoomModal(undefined)}
      >
        <div className="bg-zinc-800 p-4 py-5 text-white">
          <ContentSubHeading>Create room</ContentSubHeading>
          <p className="text-xs">Create room and invite other&apos;s</p>
          <FlexContainer className="flex-col gap-4 mt-3">
            <TextInput
              placeholder="Room ID (e.g discord99)"
              className="border-b border-primary focus:border-b-2 shadow-md"
              value={roomInput.roomId}
              onChange={(e) => onChangeRoomInput("roomId", e.target.value)}
              errorMessage={formErrors?.roomId}
            />
            <TextInput
              type="password"
              placeholder="Room password"
              className="border-b border-primary focus:border-b-2 shadow-md"
              value={roomInput.password}
              onChange={(e) => onChangeRoomInput("password", e.target.value)}
              errorMessage={formErrors?.password}
            />

            <FlexContainer className="w-full justify-end">
              <Button
                className="bg-primary"
                onClick={onRoomCreate}
                loading={loading}
              >
                Create
              </Button>
            </FlexContainer>
          </FlexContainer>
        </div>
      </Modal>

      {/* join room modal */}
      <Modal
        visible={roomModal === "join"}
        onClose={() => setRoomModal(undefined)}
      >
        <div className="bg-zinc-800 p-4 py-5 text-white">
          <ContentSubHeading>Join room</ContentSubHeading>
          <p className="text-xs">Join room and play with other&apos;s</p>
          <FlexContainer className="flex-col gap-4 mt-3">
            <TextInput
              placeholder="Room ID (e.g discord99)"
              className="border-b border-primary focus:border-b-2 shadow-md"
              value={roomInput.roomId}
              onChange={(e) => onChangeRoomInput("roomId", e.target.value)}
              errorMessage={formErrors?.roomId}
            />
            <TextInput
              type="password"
              placeholder="Room password"
              className="border-b border-primary focus:border-b-2 shadow-md"
              value={roomInput.password}
              onChange={(e) => onChangeRoomInput("password", e.target.value)}
              errorMessage={formErrors?.password}
            />

            <FlexContainer className="w-full justify-end">
              <Button
                className="bg-primary"
                loading={loading}
                onClick={onJoinRoom}
              >
                Join
              </Button>
            </FlexContainer>
          </FlexContainer>
        </div>
      </Modal>
    </>
  );
};

export default HomePage;
