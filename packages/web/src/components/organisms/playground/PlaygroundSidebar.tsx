import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IRoom, IRoomSettings } from "@card-32/common/types/room";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { useCardsContext } from "../../../contexts/CardsProvider";
import { useRoomContext } from "../../../contexts/RoomProvider";
import { useSocketContext } from "../../../contexts/SocketProvider";
import { ROOMS } from "../../../routes/routes";
import { removeDataOnLocalStorage } from "../../../utils/localStorage";
import AnimatedCircle from "../../atoms/box/AnimatedCircle";
import FlexContainer from "../../atoms/box/FlexContainer";
import Button from "../../atoms/button/Button";
import Modal from "../../atoms/modal/Modal";
import { ContentSubHeading } from "../../atoms/texts/ContentSubHeading";
import { PlayerCard } from "./PlayerCard";
import { RoomSettingsModal } from "./RoomSettingsModal";

const PlaygroundSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { player, setPlayer } = useAuthContext();
  const { room, setRoom, isRoomFull } = useRoomContext();
  const { cards, bidPoints, usedCards, isBidDone } = useCardsContext();
  const { isSocketConnected, socket } = useSocketContext();
  const [leaveRoomModal, setLeaveRoomModal] = useState(false);
  const [roomSettingsModal, setRoomSettingsModal] = useState(false);

  const onStartGame = () => {
    if (!socket) return;
    if (!room) return;
    if (!isRoomFull) {
      return toast.error(
        `Invite ${4 - room.players.length} more players to start the game.`,
        { icon: "⚠️" }
      );
    }
    socket.emit(MAIN_NAMESPACE_EVENTS.START_GAME);
  };

  const getBidPoint = useCallback(
    (playerId: string) => {
      if (!bidPoints?.length) {
        return { bid: 0, point: 0 };
      }
      const player = bidPoints.find((data) => data.playerId === playerId);
      if (!player) return { bid: 0, point: 0 };

      return { bid: player.bid, point: player.point };
    },
    [bidPoints]
  );

  const onRoomSettingsSave = useCallback(
    (roomSettings: IRoomSettings) => {
      if (!socket) return;
      socket.emit(
        MAIN_NAMESPACE_EVENTS.CHANGE_ROOM_SETTINGS,
        {
          data: { settings: roomSettings },
        },
        (error?: string, room?: IRoom) => {
          if (error) {
            toast.error(error);
            return;
          }
          if (!room) {
            toast.error("Something went wrong");
            return;
          }
          setRoom(room);
          setRoomSettingsModal(false);
          toast.success("Settings saved.");
        }
      );
    },
    [socket, setRoom]
  );

  const onLeave = async () => {
    if (!socket) return;
    socket.emit(MAIN_NAMESPACE_EVENTS.LEAVE_ROOM);
    removeDataOnLocalStorage();
    setPlayer(undefined);
    setRoom(undefined);
    setLeaveRoomModal(false);
    navigate(ROOMS);
  };

  const onHomeButtonClick = () => {
    window.open(ROOMS);
  };

  const getCardServedStatus = useCallback(
    (playerId: string) => {
      if (!isBidDone) return undefined;
      const isCardServed = usedCards.find((data) => data.playerId === playerId);
      return !!isCardServed;
    },
    [isBidDone, usedCards]
  );

  const isCardsReceived = !!cards.length;
  const isRoomCreator = room?.creator.playerId === player?.playerId;

  return (
    <div className="w-full sm:w-[320px] bg-zinc-800 relative">
      <FlexContainer className="justify-between bg-zinc-700 px-2 shadow">
        <FlexContainer className="my-2 gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow">
            <img
              src="https://random.imagecdn.app/100/100"
              alt="user"
              className="w-full h-full rounded-full border-2 border-blue-500"
            />
          </div>
          <div>
            <p className="text-sm sm:text-lg sm:leading-6 font-bold">
              {player?.username}
            </p>
            <p className="text-xs">don&apos;t freeze</p>
          </div>
        </FlexContainer>
        <FlexContainer className="gap-1">
          {/* <button
            className="hidden sm:block btn-primary"
            onClick={() =>
              setSidebarOrder(
                sidebarOrder === 1 ? 2 : sidebarOrder === 2 ? 1 : 1
              )
            }
          >
            <i className="fa-solid fa-table-cells-large"></i>
          </button> */}
          <button className="btn-primary" onClick={onHomeButtonClick}>
            <i className="fa-sharp fa-solid fa-house-user"></i>
          </button>
          <button
            className="btn-primary text-red-600"
            onClick={() => setLeaveRoomModal(true)}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </FlexContainer>
      </FlexContainer>
      <div className="hidden sm:block mt-20">
        <FlexContainer className="flex-col justify-center gap-2 text-gray-400">
          <FlexContainer>
            <div className="flex flex-col">
              <p className="text-xs -mb-1.5">Room ID</p>
              <div className="flex gap-1 items-center">
                <AnimatedCircle socketConnected={isSocketConnected} />
                <p className="text-lg select-all font-semibold text-ellipsis text-center">
                  {room?.roomId}
                </p>
              </div>
            </div>
          </FlexContainer>
          <FlexContainer className="text-xs justify-center gap-2">
            <i className="fa-solid fa-users"></i>
            <p>{`${room?.players.length || 0} / 4`}</p>
          </FlexContainer>
        </FlexContainer>

        {/* player cards */}
        <FlexContainer className="justify-center my-4 mt-8">
          {room?.players.length ? (
            <div className="inline-grid grid-cols-2 grid-rows-2 gap-4">
              {room.players.map((player) => (
                <PlayerCard
                  key={player.playerId}
                  username={player.username}
                  bidPoint={getBidPoint(player.playerId)}
                  isCardServed={getCardServedStatus(player.playerId)}
                />
              ))}
            </div>
          ) : null}
        </FlexContainer>
      </div>
      {/* mobile view */}
      <div className="block sm:hidden p-2 py-3">
        <FlexContainer className="justify-between gap-2">
          <div className="flex flex-col">
            <p className="text-xs text-gray-400 -mb-1.5">Room ID</p>
            <div className="flex gap-1 items-center">
              <AnimatedCircle socketConnected={isSocketConnected} />
              <p className="text-lg select-all font-semibold text-ellipsis text-center">
                {room?.roomId}
              </p>
            </div>
          </div>
          <FlexContainer className="gap-2">
            {isRoomCreator ? (
              <button
                className="btn-primary border-2 border-zinc-700 p-1 text-xs"
                onClick={() => setRoomSettingsModal(true)}
              >
                <i className="fa-solid fa-gear" />
              </button>
            ) : null}
            {isCardsReceived ? null : (
              <button
                className="btn-primary p-1 text-xs border-2 border-blue-600 shadow-blue-600"
                onClick={onStartGame}
              >
                Start Game
              </button>
            )}
          </FlexContainer>
        </FlexContainer>

        {room?.players.length ? (
          <div className="mt-3 inline-grid grid-cols-4 grid-rows-1 gap-2">
            {room.players.map((player) => (
              <PlayerCard
                key={player.playerId}
                username={player.username}
                bidPoint={getBidPoint(player.playerId)}
                isCardServed={getCardServedStatus(player.playerId)}
              />
            ))}
          </div>
        ) : null}
      </div>
      {/* sidebar bottom content */}
      <div className="hidden sm:flex w-full absolute bottom-0 p-2 flex-col gap-2">
        <FlexContainer className="items-center justify-between">
          {isRoomCreator ? (
            <button
              className="btn-primary border-2 border-zinc-700"
              onClick={() => setRoomSettingsModal(true)}
            >
              <i className="fa-solid fa-gear" />
            </button>
          ) : null}
          {isCardsReceived ? null : (
            <button
              className="btn-primary border-2 border-blue-600 shadow-blue-600"
              onClick={onStartGame}
            >
              Start Game
            </button>
          )}
        </FlexContainer>
      </div>

      {/* room leave modal */}
      <Modal visible={leaveRoomModal} onClose={() => setLeaveRoomModal(false)}>
        <FlexContainer className="flex-col gap-4 items-start text-white">
          <ContentSubHeading>Leave room?</ContentSubHeading>
          <p className="text-gray-300">
            Are you sure you want to leave this room?
          </p>

          <FlexContainer className="w-full justify-end gap-2">
            <Button
              className="bg-zinc-700"
              onClick={() => setLeaveRoomModal(false)}
            >
              No
            </Button>
            <Button className="bg-red-600" onClick={onLeave}>
              Yes
            </Button>
          </FlexContainer>
        </FlexContainer>
      </Modal>

      {/* room settings modal */}
      <RoomSettingsModal
        visible={roomSettingsModal}
        onClose={() => {
          setRoomSettingsModal(false);
        }}
        onSave={onRoomSettingsSave}
      />
    </div>
  );
};

export default PlaygroundSidebar;
