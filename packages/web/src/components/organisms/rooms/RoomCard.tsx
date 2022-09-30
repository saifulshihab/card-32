import { IRoom } from "@card-32/common/types/room";
import React, { PropsWithChildren } from "react";
import { useAuthContext } from "../../../contexts/AuthProvider";

interface IProps {
  room: IRoom;
  onClick?: (roomId: string, roomCreatorId: string) => void;
}

const RoomCard: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { room, onClick } = props;
  const { player } = useAuthContext();
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
        {room.creator.playerId === player?.playerId ||
        room.players.length === 4 ? null : (
          <button
            className="btn-primary border border-primary shadow"
            onClick={() =>
              onClick && onClick(room.roomId, room.creator.playerId)
            }
          >
            Join
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
