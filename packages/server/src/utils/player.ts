import { players } from "../database";

export const getPlayerIntoRoom = (loginInput: any) => {
  const { username, roomId } = loginInput;
  const usernameTaken = players.find(
    (player) => player.username === username && player.playerId === roomId
  );

  if (usernameTaken) {
    return { error: "Username taken" };
  }
  if (players.length > 4) {
    return { error: "Room is full" };
  }

  players.push(loginInput);
  return { player: loginInput };
};

export const roomPlayers = (roomId: string) =>
  players.filter((player) => player.playerId === roomId);

export const removePlayer = (id: string) => {
  const userIndex = players.findIndex((player) => player.playerId === id);
  if (userIndex > -1) {
    return players.splice(userIndex, 1)[0];
  }
  return undefined;
};

export const getPlayer = (id: string) =>
  players.find((user) => user.playerId === id);
