/**
 * namespace: "/"
 * auth: no-auth
 */

import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { Namespace, Server, Socket } from "socket.io";
import { logger } from "../utils/winston";

let mainIO: Namespace;
const events = MAIN_NAMESPACE_EVENTS;

const mainSocketIO = (server: Server) => {
  mainIO = server.of("/");

  mainIO.on(events.CONNECTION, (socket: Socket) => {
    logger.info("new connection joined");

    socket.on(events.DISCONNECT, () => {
      logger.info(`${socket.id} has left`);
    });
  });
};

export { mainSocketIO };
