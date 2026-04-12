import type { NextFunction, Request, Response } from "express";
import type { ErrorType } from "../utility/Error.ts";

const errorHandler = (
  err: Error & ErrorType,
  req: Request,
  res: Response<Omit<Error, "name"> & ErrorType>,
  next: NextFunction,
) => {
  res.status(err.status).json({
    message: err.message,
    status: err.status,
    success: err.success,
  });
};

export default errorHandler;
