import {
  LOCAL_STORAGE_KEYS,
  getPlayerAndRoomIdFromLocalStorage,
  setPlayerAndRoomIdOnLocalStorage,
} from "../utils/localStorage";

describe("Local storage utils tests", () => {
  beforeEach(() => {
    localStorage.clear(); // clear local storage before each test
  });

  test("player & room id are saved", () => {
    const data = {
      player: {
        playerId: "001",
        username: "shihab",
      },
      roomId: "room69",
    };
    setPlayerAndRoomIdOnLocalStorage(data);
    const playerData = localStorage.getItem(LOCAL_STORAGE_KEYS.player);
    const roomData = localStorage.getItem(LOCAL_STORAGE_KEYS.roomId);
    expect(playerData).toBe(JSON.stringify(data.player));
    expect(roomData).toBe(JSON.stringify(data.roomId));
  });

  test("player & room id are returned", () => {
    const data = {
      player: {
        playerId: "001",
        username: "shihab",
      },
      roomId: "room69",
    };
    setPlayerAndRoomIdOnLocalStorage(data);
    const result = getPlayerAndRoomIdFromLocalStorage();
    const player = result.player;
    const roomId = result.roomId;
    expect(player).toMatchObject({
      playerId: "001",
      username: "shihab",
    });
    expect(roomId).toMatch("room69");
  });
});
