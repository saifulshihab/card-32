import { IRoom } from "@card-32/common/types/room";
import React, { PropsWithChildren } from "react";
import FlexContainer from "../../atoms/box/FlexContainer";
import moment from "moment";

interface IProps {
  room: IRoom;
}

const RoomCard: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { room } = props;
  const { roomId, createdAt, players } = room;
  const isRoomFull = players.length === 4;
  return (
    <div className="p-2 px-3 rounded-md shadow border-2 border-primary">
      <h3 className="text-lg font-semibold truncate">{roomId}</h3>
      <p className="text-xs text-gray-400">
        {moment(createdAt).fromNow(false)}
      </p>
      <FlexContainer className="justify-between mt-5">
        <FlexContainer>
          <span className="text-xs mr-1">
            <i className="fa-solid fa-users"></i>
          </span>
          <p className="text-sm">{room.players.length}/4</p>
        </FlexContainer>
        {isRoomFull ? null : <button className="btn-primary">Join</button>}
      </FlexContainer>
    </div>
  );
};

export default RoomCard;
