import { rooms } from "../server";
import { ICard } from "../types/card";

export const isRoomExist = (roomId: string) =>
  rooms.some((room) => room.roomId === roomId);

const getRoom = (roomId: string) =>
  rooms.find((room) => room.roomId === roomId);

function shuffleArray<A>(array: A[]): A[] {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const getRandomNumbers = () => {
  const numbers: number[] = [];
  for (let i = 0; i < 32; i += 1) {
    numbers.push(i + 1);
  }
  return shuffleArray(numbers);
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
          cardId: number.toString(),
          value: number,
          playerId: player.playerId,
        });
      });
    });

    return { cards };
  } catch {
    return { cards: null };
  }
};

export { generateCards };
