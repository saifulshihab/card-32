import { IRoom } from "@card-32/common/types/room";
import React, { PropsWithChildren } from "react";

interface IProps {
  room: IRoom;
}

const RoomCard: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { room } = props;
  return (
    <div className="py-5 px-7 bg-zinc-800 shadow-md flex flex-col gap-3 rounded-lg">
      <p className="text-lg font-semibold">{room.roomId}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs">Players {room.players.length}/4</p>
          <p className="text-xs text-gray-400">
            Created by {room.creator.username}
          </p>
        </div>
        {room.players.length === 4 ? null : (
          <button className="btn-primary border border-primary shadow">
            Join
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
