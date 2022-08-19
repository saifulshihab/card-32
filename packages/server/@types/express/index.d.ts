/* eslint-disable no-unused-vars */
import { IUser } from "@card-32/common/types/user";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
