import { IRoomCreateIOrJoinInput } from "@card-32/common/types/room";
import { Form, Formik } from "formik";
import React from "react";
import { roomJoinValidationSchema } from "../../../validators/playerValidators";
import FlexContainer from "../../atoms/box/FlexContainer";
import TextInput from "../../atoms/inputs/TextInput";
import Modal, { IModalProps } from "../../atoms/modal/Modal";

interface IProps extends IModalProps {
  onSubmit?: (
    joinInput: IRoomCreateIOrJoinInput,
    callback?: () => void
  ) => void;
}

const CreateOrJoinRoomModal: React.FC<IProps> = (props) => {
  const { onSubmit } = props;

  return (
    <Modal {...props}>
      <Formik
        initialValues={{
          username: "",
          roomId: "",
        }}
        validationSchema={roomJoinValidationSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit && onSubmit(values, () => resetForm());
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
                Enter
              </button>
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateOrJoinRoomModal;
