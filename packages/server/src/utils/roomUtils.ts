import { v4 as uuidv4 } from "uuid";
import { rooms } from "../server";
import { ICard } from "../types/card";

export const isRoomExist = (roomId: string) =>
  rooms.some((room) => room.roomId === roomId);

const getRoom = (roomId: string) =>
  rooms.find((room) => room.roomId === roomId);

const getRandomNumbers = () => {
  const numbers: number[] = [];

  for (let i = 0; i < 32; i += 1) {
    numbers.push(i + 1);
  }

  return numbers.sort(() => 0.7 - Math.random());
};

const generateCards = (roomId: string) => {
  try {
    const cards: ICard[] = [];
    const numbers = getRandomNumbers();
    const room = getRoom(roomId);

    if (!room) {
      return { cards: null };
    }

    room.players.forEach((player, idx) => {
      const slicedNumbers = numbers.slice((idx + 1 - 1) * 8, (idx + 1) * 8);
      slicedNumbers.forEach((number) => {
        cards.push({
          cardId: uuidv4(),
          value: number,
          playerId: player.playerId,
          used: false,
        });
      });
    });

    return { cards };
  } catch {
    return { cards: null };
  }
};

export { generateCards };
