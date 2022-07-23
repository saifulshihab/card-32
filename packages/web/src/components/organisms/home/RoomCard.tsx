import { IActiveRoom } from "@card-32/common/types/room";
import React, { PropsWithChildren } from "react";
import FlexContainer from "../../atoms/box/FlexContainer";

interface IProps {
  room: IActiveRoom;
}

const RoomCard: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { room } = props;
  return (
    <div className="p-2 px-3 rounded-lg shadow border border-primary">
      <h3 className="text-lg truncate">{room.roomId}</h3>
      <FlexContainer className="justify-between mt-5">
        <p>{room.numOfUsers}/4</p>
        <button className="btn-primary">Join</button>
      </FlexContainer>
    </div>
  );
};

export default RoomCard;
