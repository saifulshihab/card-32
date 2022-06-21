import { roomUsers } from "./database";
import { io } from "./server";
import { ILoginInput } from "./types/login";
import { getUserIntoRoom } from "./utils/user";

io.on("connection", (socket) => {
  // login
  socket.on("login", (input: ILoginInput, callback) => {
    const { error, user } = getUserIntoRoom({
      id: socket.id,
      username: input.username,
      roomId: input.roomId,
    });

    if (error) {
      return callback(error, null);
    }
    if (!user) return callback("Somthing went wrong", null);

    socket.join(user.roomId);

    io.to(user.roomId).emit("roomUsers", {
      roomId: user.roomId,
      users: roomUsers(user.roomId),
    });
    return callback(null, { userId: socket.id });
  });
});
