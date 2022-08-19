import { createRoomSchema } from "@card-32/common/validators/roomValidator";
import { Router } from "express";
import { createRoom } from "../controller/roomController";
import { authenticator } from "../middlewares/authenticator";
import { inputValidator } from "../middlewares/inputValidator";

const router = Router();

// create room
router
  .route("/")
  .post(authenticator(), inputValidator(createRoomSchema), createRoom);

export default router;
