import { v4 as uuidv4 } from "uuid";
import { cards, rooms } from "../server";

const getRandomIntegers = () => {
  const totalCards = 32;
  const numbers: number[] = [];

  for (let i = 0; i < totalCards; i += 1) {
    numbers.push(i + 1);
  }
  return numbers.sort(() => 0.7 - Math.random());
};

const generateCards = (roomId: string) => {
  const generatedNumbers = getRandomIntegers();
  const roomPlayers = rooms.find((room) => room.roomId === roomId)?.players!;

  roomPlayers.forEach((player, idx) => {
    const slicedNumbers = generatedNumbers.slice(
      (idx + 1 - 1) * 8,
      (idx + 1) * 8
    );

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
};

export { generateCards };
