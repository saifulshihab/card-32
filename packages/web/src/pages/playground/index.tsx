import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { TGenericMessage } from "@card-32/common/types/player";
import {
  IRoomJoinRequestInput,
  TRoomJoinRequestStatus,
} from "@card-32/common/types/room";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/atoms/modal/Modal";
import Chat from "../../components/organisms/chat";
import Board from "../../components/organisms/playground/Board";
import { Card } from "../../components/organisms/playground/card/Card";
import PlaygroundSidebar from "../../components/organisms/playground/PlaygroundSidebar";
import { useAuthContext } from "../../contexts/AuthProvider";
import { useCardsContext } from "../../contexts/CardsProvider";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useSocketContext } from "../../contexts/SocketProvider";
import { ROOMS } from "../../routes/routes";
import { removeDataOnLocalStorage } from "../../utils/localStorage";

const Playground: React.FC = () => {
  const navigate = useNavigate();
  const { socket } = useSocketContext();
  const { player, roomId } = useAuthContext();
  const { room } = useRoomContext();
  const { cards, bidPoints, usedCards } = useCardsContext();
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [messages, setMessages] = useState<TGenericMessage[]>([]);
  const [newJoinRequest, setNewJoinRequest] = useState<
    IRoomJoinRequestInput | undefined
  >(undefined);
  const [bidModalVisible, setBidModalVisible] = useState(false);

  useEffect(() => {
    if (!player || !roomId) {
      navigate(ROOMS);
    }
  }, [player, roomId, navigate]);

  useEffect(() => {
    if (!socket) return;

    // new room join request
    socket.on(
      MAIN_NAMESPACE_EVENTS.JOIN_REQUEST,
      (data: IRoomJoinRequestInput) => {
        setNewJoinRequest(data);
      }
    );

    // room chat - send message
    socket.on(
      MAIN_NAMESPACE_EVENTS.NEW_MESSAGE,
      ({ data }: { data: TGenericMessage }) => {
        setMessages((prev) => [...prev, data]);
      }
    );

    // new room creator assigned
    socket.on(MAIN_NAMESPACE_EVENTS.NEW_ROOM_CREATOR, () => {
      toast.success("You are now room creator.");
    });

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.JOIN_REQUEST);
      socket.off(MAIN_NAMESPACE_EVENTS.NEW_MESSAGE);
      socket.off(MAIN_NAMESPACE_EVENTS.NEW_ROOM_CREATOR);
    };
  }, [socket]);

  useEffect(() => {
    // close request modal after 10 second
    if (!newJoinRequest) return;
    const timeout = setTimeout(() => {
      setNewJoinRequest(undefined);
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, [newJoinRequest]);

  useEffect(() => {
    // remove localstorage data on window close or page refresh
    window.onbeforeunload = () => {
      removeDataOnLocalStorage();
    };
  }, []);

  // open bid modal when cards received and player don't bid yet
  useEffect(() => {
    if (bidPoints === null) {
      setBidModalVisible(false);
      return;
    }

    const bidDone = bidPoints.find(
      (data) => data.playerId === player?.playerId
    );

    if (!bidDone) {
      setBidModalVisible(true);
    }
  }, [bidPoints, player?.playerId]);

  // get round winner when 4 cards dropped
  useEffect(() => {
    if (!socket) return;

    // this func will be called in room creator profile only
    if (usedCards.length !== 4) return;
    if (player?.playerId !== room?.creator.playerId) return;
    if (!bidPoints?.length) return;

    try {
      // get winner card
      const winnerCard = usedCards.reduce((prev, curr) =>
        prev.value > curr.value ? prev : curr
      );

      const winner = room?.players.find(
        (player) => player.playerId === winnerCard.playerId
      );
      if (!winner) return;

      // updated bid points
      const updatedBidPoints = bidPoints.map((data) =>
        data.playerId === winner?.playerId
          ? {
              ...data,
              point: data.point + 1,
            }
          : data
      );

      // remove used cards
      const usedCardsIds = usedCards.map((card) => card.cardId);
      const updatedCards = cards.filter(
        (card) => !usedCardsIds.includes(card.cardId)
      );

      socket.emit(MAIN_NAMESPACE_EVENTS.ROUND_WINNER, {
        data: {
          winnerUsername: winner.username,
          bidPoints: updatedBidPoints,
          cards: updatedCards,
        },
      });
    } catch {
      toast.error("Something went wrong");
    }
  }, [
    socket,
    cards,
    usedCards,
    bidPoints,
    room?.players,
    player?.playerId,
    usedCards.length,
    room?.creator.playerId,
  ]);

  // send message
  const handleSendMessage = (message: string, callback?: () => void) => {
    if (!socket) return;
    if (!message) return;
    socket.emit(MAIN_NAMESPACE_EVENTS.SEND_MESSAGE, {
      message,
      username: player?.username,
    });
    callback && callback();
  };

  // send join request response
  const sendJoinRequestResponse = (status: TRoomJoinRequestStatus) => {
    if (!socket) return;
    socket.emit(MAIN_NAMESPACE_EVENTS.JOIN_REQUEST_RESPONSE, {
      status,
      joinRequest: newJoinRequest,
    });
    setNewJoinRequest(undefined);
  };

  // send bid point
  const sendBidPoint = (bid: number) => {
    if (!socket) return;
    socket.emit(
      MAIN_NAMESPACE_EVENTS.ON_BID,
      { bid },
      (result: { data: string }) => {
        if (!result) {
          toast.error("Something went wrong");
          return;
        }
        setBidModalVisible(false);
      }
    );
  };

  const handleBidModalClose = () => {
    return;
  };

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row gap-1 relative">
      {/* left sidebar */}
      <PlaygroundSidebar />
      {/* board & chat */}
      <Board />
      <div className="hidden xl:block xl:w-[320px]">
        <Chat messages={messages} handleSendMessage={handleSendMessage} />
      </div>

      <button
        className="absolute xl:hidden z-20 bottom-3 right-3 shadow-md sm:top-3 sm:right-3 w-12 h-12 rounded-full btn-primary flex items-center justify-center
        bg-zinc-900 sm:bg-zinc-800 border-zinc-700
        "
        onClick={() => {
          setChatBoxVisible(!chatBoxVisible);
        }}
      >
        {chatBoxVisible ? (
          <i className="fa-solid fa-xmark"></i>
        ) : (
          <i className="fa-solid fa-message"></i>
        )}
      </button>

      {/* floating chat box */}
      <div
        className={`w-[90%] border-2 rounded border-zinc-700 z-10 h-[93%] sm:h-[90%] absolute right-3 sm:w-[320px] sm:right-16 sm:mt-14 floatingChatBox ${
          chatBoxVisible ? "block" : "hidden"
        }`}
      >
        <Chat messages={messages} handleSendMessage={handleSendMessage} />
      </div>

      {/* join request accept/reject modal */}
      <Modal
        visible={!!newJoinRequest}
        onClose={() => setNewJoinRequest(undefined)}
      >
        <div className="flex flex-col gap-8 items-center">
          {newJoinRequest?.username ? (
            <p className="text-xl font-bold">
              <span className="text-primary">{newJoinRequest?.username}</span>{" "}
              wants to join.
            </p>
          ) : null}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 items-center">
              <button
                className="btn-primary rounded-full bg-lime-500 w-10 h-10 flex items-center justify-center"
                onClick={() => sendJoinRequestResponse("accepted")}
              >
                <i className="fa-solid fa-check"></i>
              </button>
              <p className="text-xs">Accept</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <button
                className="btn-primary rounded-full bg-red-500 w-10 h-10 flex items-center justify-center"
                onClick={() => sendJoinRequestResponse("rejected")}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <p className="text-xs">Reject</p>
            </div>
          </div>
        </div>
      </Modal>
      {/* bid select modal */}
      <Modal visible={bidModalVisible} onClose={handleBidModalClose}>
        <div className="flex flex-col items-center bg-zinc-900 text-white gap-2">
          <p className="font-semibold">Your Cards</p>
          <div className="flex items-center gap-1 mb-4">
            {cards.length
              ? cards
                  .filter((data) => data.playerId === player?.playerId)
                  ?.map((card) => <Card key={card.cardId} card={card} />)
              : null}
          </div>
          <p className="text-sm font-semibold">Select your bid point</p>
          <Formik
            initialValues={{
              bid: "1",
            }}
            onSubmit={(values) => {
              if (values.bid) {
                sendBidPoint(parseInt(values.bid));
              }
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form
                className="inline-flex flex-col gap-2"
                onSubmit={handleSubmit}
              >
                <select
                  value={values.bid}
                  name="bid"
                  onChange={handleChange}
                  className="my-3 w-20 h-20 bg-zinc-800 shadow-md border-2 border-blue-700 border-dotted rounded py-1.5 text-center outline-none cursor-pointer focus:ring-2 ring-blue-700 text-2xl"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                </select>
                <button
                  type="submit"
                  className="btn-primary  bg-primary text-xs py-2 px-3"
                >
                  Bid
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-xs text-gray-400">
            Note: Bid can&apos;t be change later
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Playground;
