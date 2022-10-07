import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { useRoomContext } from "../../../contexts/RoomProvider";
import { useSocketContext } from "../../../contexts/SocketProvider";
import { HOME } from "../../../routes/routes";
import { removeDataOnLocalStorage } from "../../../utils/localStorage";
import AnimatedCircle from "../../atoms/box/AnimatedCircle";
import FlexContainer from "../../atoms/box/FlexContainer";
import Button from "../../atoms/button/Button";
import Modal from "../../atoms/modal/Modal";
import { ContentSubHeading } from "../../atoms/texts/ContentSubHeading";
import { showToastMessage } from "../../atoms/toast";
import { PlayerCard } from "../playerCard";

const PlaygroundSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { player, setPlayer } = useAuthContext();
  const { room, setRoom } = useRoomContext();
  const { isSocketConnected, socket } = useSocketContext();

  const [leaveRoomModal, setLeaveRoomModal] = useState(false);
  const [bidModalVisible, setBidModalVisible] = useState(false);

  const onStartGame = () => {
    if (!room) return;
    if (room.players.length < 4) {
      showToastMessage({
        type: "warning",
        message: `Invite ${
          4 - room.players.length
        } more players to start the game.`,
      });
      return;
    }
  };

  const onLeave = async () => {
    if (!socket) return;
    socket.emit(MAIN_NAMESPACE_EVENTS.LEAVE_ROOM);
    removeDataOnLocalStorage();
    setPlayer(undefined);
    setRoom(undefined);
    setLeaveRoomModal(false);
    navigate(HOME);
  };

  const onHomeButtonClick = () => {
    window.open(HOME);
  };

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
        <FlexContainer className="flex-col justify-center gap-2">
          <FlexContainer>
            <div className="flex flex-col">
              <p className="text-xs text-gray-400 -mb-1.5">Room ID</p>
              <div className="flex gap-1 items-center">
                <AnimatedCircle socketConnected={isSocketConnected} />
                <p className="text-lg select-all font-semibold text-ellipsis text-center">
                  {room?.roomId}
                </p>
              </div>
            </div>
          </FlexContainer>
          <FlexContainer className="text-xs justify-center font-thin gap-2">
            <i className="fa-solid fa-users"></i>
            <p className="text-xs text-white">{`${
              room?.players.length || 0
            } / 4`}</p>
          </FlexContainer>
        </FlexContainer>

        {/* player cards */}
        <FlexContainer className="justify-center my-4 mt-8">
          {room?.players.length ? (
            <div className="inline-grid grid-cols-2 grid-rows-2 gap-4">
              {room.players.map((player) => (
                <PlayerCard key={player.playerId} username={player.username} />
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
            <button
              className="btn-primary p-1 text-xs border-2 border-blue-600 shadow-blue-600"
              onClick={onStartGame}
            >
              Start Game
            </button>
            <button className="btn-primary p-1 text-xs border-2 border-primary shadow-primary">
              Restart
            </button>
          </FlexContainer>
        </FlexContainer>

        {room?.players.length ? (
          <div className="mt-3 inline-grid grid-cols-4 grid-rows-1 gap-2">
            {room.players.map((player) => (
              <PlayerCard key={player.playerId} username={player.username} />
            ))}
          </div>
        ) : null}
      </div>
      {/* sidebar bottom content */}
      <div className="hidden sm:flex w-full absolute bottom-0 p-2 flex-col gap-2">
        <FlexContainer className="gap-2 justify-center">
          <button
            className="btn-primary border-2 border-blue-600 shadow-blue-600"
            onClick={onStartGame}
          >
            Start Game
          </button>
          <button className="btn-primary border-2 border-primary shadow-primary">
            Restart
          </button>
        </FlexContainer>
      </div>
      {/* bid select modal */}
      <Modal visible={bidModalVisible} onClose={setBidModalVisible}>
        <FlexContainer className="p-5 bg-zinc-900 text-white  flex-col gap-2">
          <p className="text-xl font-bold">Select your bid point</p>
          <select className="my-3 w-20 h-20 bg-zinc-800 shadow-md border-2 border-blue-700 border-dotted rounded py-1.5 text-center outline-none cursor-pointer focus:ring-2 ring-blue-700 text-2xl">
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
          </select>
          <button className="btn-primary  bg-blue-700 text-xs py-2 px-3">
            Bid
          </button>
        </FlexContainer>
      </Modal>
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
    </div>
  );
};

export default PlaygroundSidebar;
