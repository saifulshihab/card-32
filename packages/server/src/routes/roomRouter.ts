import {
  createRoomSchema,
  roomIdParamsSchema,
} from "@card-32/common/validators/roomValidator";
import { Router } from "express";
import { createRoom, deleteRoom } from "../controller/roomController";
import { authenticator } from "../middlewares/authenticator";
import { inputValidator } from "../middlewares/inputValidator";

const router = Router();

router
  .route("/")
  // create room
  .post(authenticator(), inputValidator(createRoomSchema), createRoom);

router
  .route("/:roomId")
  // delete room by creator
  .delete(
    authenticator(),
    inputValidator(null, roomIdParamsSchema),
    deleteRoom
  );

export default router;
