/* eslint-disable no-console */
import { IPlayer } from "@card-32/common/types/player";
import { IUserLoginResponse } from "../api/userApi";

interface ILocalStorageKeys {
  player: string;
  user: string;
  accessToken: string;
}

export interface IUserLocalStorage {
  userId: string;
  username: string;
}

export const LOCAL_STORAGE_KEYS: ILocalStorageKeys = {
  player: "card-32.player",
  user: "card-32.user",
  accessToken: "card-32.accessToken",
};

export const setPlayerOnLocalStorage = (player: IPlayer) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.player, JSON.stringify(player));
  } catch (err) {
    console.error(err);
  }
};

export const getPlayerFromLocalStorage = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.player);
  if (data) {
    const player = JSON.parse(data) as IPlayer;
    return { player };
  }
};

export const setUserAndTokenOnLocalStorage = (data: IUserLoginResponse) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.user, JSON.stringify(data.user));
    localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, data.accessToken);
  } catch (err) {
    console.error(err);
  }
};

export const getUserAndTokenFromLocalStorage = () => {
  const user = localStorage.getItem(LOCAL_STORAGE_KEYS.user);
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
  if (user && accessToken) {
    const userParsed = JSON.parse(user);
    return {
      user: userParsed as IUserLocalStorage,
      accessToken,
    };
  }
};

export const removeDataOnLocalStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.player);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.user);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
};
