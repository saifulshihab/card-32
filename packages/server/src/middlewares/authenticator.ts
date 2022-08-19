import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_USER_SECRET } from "../config/env";
import { User } from "../models/user";

export function sendUnauthorized(res: Response) {
  return res.status(401).send("Unauthorized");
}

export function sendDontHaveAccess(res: Response) {
  return res
    .status(403)
    .send("You don't have the rights to access this content.");
}

export function authenticator() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization;
      if (!authToken) return sendUnauthorized(res);

      const verified = jwt.verify(authToken, JWT_USER_SECRET);
      if (!verified) return sendUnauthorized(res);

      const tokenData: any = jwt.decode(authToken);

      const user = await User.findOne({
        _id: tokenData._id,
      });

      if (!user) return sendUnauthorized(res);

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).send("Unauthorized");
    }
  };
}
