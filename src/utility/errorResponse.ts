import type { Response } from "express";

interface Error {
  res: Response;
  success?: boolean;
  message: string;
  status: number;
}

export const errorResponse = ({ res, status, message, success }: Error) => {
  return res.status(status).json({
    success: success || false,
    message,
    status,
  });
};

export const isErrorResponse = (error: any): error is Error => {
  return (
    error &&
    typeof error === "object" &&
    error.success &&
    typeof error.success === "boolean" &&
    error.message &&
    typeof error.message === "string" &&
    error.status &&
    typeof error.status === "number"
  );
};
