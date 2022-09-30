import { ROOM_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import {
  IRoomCreateIOrJoinInput,
  IRoomCreateOrJoinResponse,
} from "@card-32/common/types/room";
import { Form, Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { useRoomContext } from "../../../contexts/RoomProvider";
import { useSocketContext } from "../../../contexts/SocketProvider";
import { PLAYGROUND } from "../../../routes/routes";
import {
  getPlayerAndRoomIdFromLocalStorage,
  setPlayerAndRoomIdOnLocalStorage,
} from "../../../utils/localStorage";
import { roomJoinValidationSchema } from "../../../validators/playerValidators";
import FlexContainer from "../../atoms/box/FlexContainer";
import TextInput from "../../atoms/inputs/TextInput";
import Modal, { IModalProps } from "../../atoms/modal/Modal";
import { showToastMessage } from "../../atoms/toast";

const localStoragePlayerAndRoom = getPlayerAndRoomIdFromLocalStorage();

const CreateOrJoinRoomModal: React.FC<IModalProps> = (props) => {
  const navigate = useNavigate();
  const { roomSocket } = useSocketContext();
  const { player, setPlayer } = useAuthContext();
  const { setRoom } = useRoomContext();

  const onJoinRoom = (joinInput: IRoomCreateIOrJoinInput, cb: () => void) => {
    if (!roomSocket) return;
    if (player && localStoragePlayerAndRoom.roomId) {
      return showToastMessage({
        type: "warning",
        message: "You already created a room.",
      });
    }
    roomSocket.emit(
      ROOM_NAMESPACE_EVENTS.JOIN_ROOM,
      joinInput,
      (response: { error?: string; data?: IRoomCreateOrJoinResponse }) => {
        const { error, data } = response;
        if (error) {
          showToastMessage({
            type: "error",
            message: error,
          });
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
        setRoom(data.room);
        navigate(PLAYGROUND(joinInput.roomId));
        cb();
      }
    );
  };

  return (
    <Modal {...props}>
      <Formik
        initialValues={{
          username: "",
          roomId: "",
        }}
        validationSchema={roomJoinValidationSchema}
        onSubmit={(values, { resetForm }) => {
          onJoinRoom(values, () => resetForm());
        }}
      >
        {() => (
          <Form>
            <FlexContainer className="flex-col gap-4 items-start">
              <p className="text-2xl font-bold mb-4">Create/Join Room</p>
              <TextInput
                label="Username"
                name="username"
                placeholder="Your username"
                className=""
              />
              <TextInput
                label="Room ID"
                name="roomId"
                placeholder="Room ID (e.g discord012)"
              />
              <button type="submit" className="btn-primary mt-4 bg-primary">
                Submit
              </button>
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateOrJoinRoomModal;
