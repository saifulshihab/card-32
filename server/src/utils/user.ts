import { users } from "../database";
import { IUser } from "../types/user";

export const getUserIntoRoom = (loginInput: IUser) => {
  const { username, roomId } = loginInput;
  const usernameTaken = users.find(
    (user) => user.username === username && user.roomId === roomId
  );

  if (usernameTaken) {
    return { error: "Username taken" };
  }
  if (users.length > 4) {
    return { error: "Room is full" };
  }

  users.push(loginInput);
  return { user: loginInput };
};
