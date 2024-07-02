import { getPlayerIntoRoom } from "../controller/roomController";
import { server } from "../server";
import { generateCards, getRandomNumbers } from "../utils/roomUtils";

describe("Room utility functions tests", () => {
  test("getRandomNumbers should return 32 numbers", () => {
    const result = getRandomNumbers();
    expect(result).toHaveLength(32);
  });

  test("getPlayerIntoRoom should add a player into a room", () => {
    // add 4 players
    getPlayerIntoRoom({
      roomId: "001",
      username: "shihab",
    });
    getPlayerIntoRoom({
      roomId: "001",
      username: "saiful",
    });
    getPlayerIntoRoom({
      roomId: "001",
      username: "islam",
    });
    const result = getPlayerIntoRoom({
      roomId: "001",
      username: "shb",
    });
    expect(result).toHaveProperty("data");
  });

  test("generateCards should generate cards for a room", () => {
    const result = generateCards("001");
    expect(result).toHaveProperty("cards");
    expect(result.cards?.length).toBe(32);
  });

  test("generateCards shouldn't generate cards if a room is not found", () => {
    const result = generateCards("002");
    expect(result.cards?.length).toBe(undefined);
  });

  afterAll(() => {
    server.close();
  });
});
