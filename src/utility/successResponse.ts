import type { Response } from "express";

interface Success<T> {
  res: Response
  success?: boolean;
  message: string;
  data?: T;
  status: number;
}

export const successResponse = <T>({res, data, message, success, status}: Success<T>) => {
  return res.status(status).json({
    data,
    message,
    success: success || true,
    status
  })
};
