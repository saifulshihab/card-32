import { Request, Response, NextFunction } from "express";

export default (
  error: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ message: "Server error" });
  console.error(error.message);
  next(error);
};
