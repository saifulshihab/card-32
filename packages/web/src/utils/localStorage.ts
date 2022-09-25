import { IPlayer } from "@card-32/common/types/player";

interface ILocalStorageKeys {
  player: string;
  roomId: string;
}

const LOCAL_STORAGE_KEYS: ILocalStorageKeys = {
  player: "card-32.player",
  roomId: "card-32.roomId",
};

export const setPlayerAndRoomIdOnLocalStorage = (data: {
  player: IPlayer;
  roomId: string;
}) => {
  const { player, roomId } = data;
  localStorage.setItem(LOCAL_STORAGE_KEYS.player, JSON.stringify(player));
  localStorage.setItem(LOCAL_STORAGE_KEYS.roomId, JSON.stringify(roomId));
};

export const getPlayerAndRoomIdFromLocalStorage = () => {
  const player = localStorage.getItem(LOCAL_STORAGE_KEYS.player);
  const roomId = localStorage.getItem(LOCAL_STORAGE_KEYS.roomId);

  const playerParsed: IPlayer = player ? JSON.parse(player) : null;
  const roomIdParsed: string = roomId ? JSON.parse(roomId) : null;

  return { player: playerParsed, roomId: roomIdParsed };
};

export const removeDataOnLocalStorage = () => {
  localStorage.clear();
};
