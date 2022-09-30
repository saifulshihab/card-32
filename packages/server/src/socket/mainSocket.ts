/**
 * namespace: "/"
 * auth: no-auth
 */

import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IGlobalMessage } from "@card-32/common/types/player";
import { Namespace, Server, Socket } from "socket.io";
import { rooms } from "../server";
import { logger } from "../utils/winston";

let io: Namespace;
const events = MAIN_NAMESPACE_EVENTS;

const mainSocketIO = (server: Server) => {
  io = server.of("/");

  io.on("connection", (socket: Socket) => {
    /**
     * send active rooms
     * when users enter rooms page this will send the current active rooms
     */
    io.emit(events.ACTIVE_ROOMS, { rooms });

    /**
     * chat - send message
     */
    socket.on(events.SEND_MESSAGE, (data: IGlobalMessage) => {
      try {
        io.emit(events.NEW_MESSAGE, { data });
      } catch (err) {
        logger.error(err);
        logger.info(err);
      }
    });
  });
};

export const updateActiveRooms = () => io.emit(events.ACTIVE_ROOMS, { rooms });

export { mainSocketIO };
