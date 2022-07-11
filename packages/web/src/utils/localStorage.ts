import { IPlayer } from "@card-32/common/types/player";

interface ILocalStorageKeys {
  player: string;
}

export const LOCAL_STORAGE_KEYS: ILocalStorageKeys = {
  player: "card-32.player",
};

export const setPlayerOnLocalStorage = (player: IPlayer) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.player, JSON.stringify(player));
  } catch (err) {
    return;
  }
};

export const getPlayerFromLocalStorage = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.player);
  if (data) {
    const player = JSON.parse(data) as IPlayer;
    return { player };
  }
};

export const removeDataOnLocalStorage = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.player);
  } catch (err) {
    return;
  }
};
