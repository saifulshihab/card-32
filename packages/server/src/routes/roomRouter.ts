import {
  createRoomSchema,
  roomIdParamsSchema,
  roomPasswordSchema,
} from "@card-32/common/validators/roomValidator";
import { Router } from "express";
import { createRoom, deleteRoom, joinRoom } from "../controller/roomController";
import { authenticator } from "../middlewares/authenticator";
import { inputValidator } from "../middlewares/inputValidator";

const router = Router();

router
  .route("/")
  // create room
  .post(authenticator(), inputValidator(createRoomSchema), createRoom);

router
  .route("/:roomId")
  // join room
  .patch(authenticator(), inputValidator(roomPasswordSchema), joinRoom)
  // delete room by creator
  .delete(
    authenticator(),
    inputValidator(null, roomIdParamsSchema),
    deleteRoom
  );

export default router;
