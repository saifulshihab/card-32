import { createRoomSchema } from "@card-32/common/validators/roomValidator";
import { yupSchemaWrapper } from "./validatorHelper";

export const roomCreateValidator = yupSchemaWrapper(createRoomSchema);
