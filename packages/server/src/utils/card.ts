import { v4 as uuidV4 } from "uuid";
import { cards, players } from "../database";

const getRandomIntegers = () => {
  const numbers: number[] = [];
  for (let i = 0; i < 32; i += 1) {
    numbers.push(i + 1);
  }
  return numbers.sort(() => 0.7 - Math.random());
};

const generateCards = (roomId: string) => {
  const generatedNumbers = getRandomIntegers();
  const roomPlayers = players.filter((player) => player.playerId === roomId);

  roomPlayers.forEach((player, idx) => {
    const slicedNumbers = generatedNumbers.slice(
      (idx + 1 - 1) * 8,
      (idx + 1) * 8
    );
    slicedNumbers.forEach((number) => {
      cards.push({
        cardId: uuidV4(),
        value: number,
        used: false,
        playerId: player.playerId,
      });
    });
  });
  return { cards };
};

export { generateCards };
