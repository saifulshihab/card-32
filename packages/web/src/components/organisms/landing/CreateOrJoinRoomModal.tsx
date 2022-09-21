import React from "react";
import FlexContainer from "../../atoms/box/FlexContainer";
import TextInput from "../../atoms/inputs/TextInput";
import Modal, { IModalProps } from "../../atoms/modal/Modal";

const CreateOrJoinRoomModal: React.FC<IModalProps> = (props) => {
  return (
    <Modal {...props}>
      <FlexContainer className="flex-col gap-4 items-start">
        <p className="text-2xl font-bold mb-4">Create/Join Room</p>
        <TextInput label="Username" placeholder="Your username" className="" />
        <TextInput label="Room ID" placeholder="Room ID (e.g discord@890)" />
        <button className="btn-primary mt-4 bg-primary">Submit</button>
      </FlexContainer>
    </Modal>
  );
};

export default CreateOrJoinRoomModal;
