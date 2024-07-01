import { generateCards, getRandomNumbers } from "../utils/roomUtils";

describe("Room utility functions tests", () => {
  test("getRandomNumbers should return 32 numbers", () => {
    const result = getRandomNumbers();
    expect(result).toHaveLength(32);
  });

  test("generateCards should generate cards for a room", () => {
    const result = generateCards("roomid-01");
    expect(result).toHaveProperty("cards");
  });
});
