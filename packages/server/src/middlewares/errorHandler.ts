import { Request, Response, NextFunction } from "express";

export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found " });
  next(error);
};

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
