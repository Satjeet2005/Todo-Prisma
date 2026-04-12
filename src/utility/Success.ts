import type { Response } from "express";

interface SuccessType<T> {
  success: boolean;
  message: string;
  data?: T;
  status: number;
}

// export const Success = <T>({
//   res,
//   data,
//   message,
//   success,
//   status,
// }: Success<T>) => {
//   return res.status(status).json({
//     data,
//     message,
//     success: success || true,
//     status,
//   });
// };

export class APISuccess<T> {
  success: boolean;
  status: number;
  data: T | undefined;
  message: string;

  constructor(res: SuccessType<T>) {
    this.success = res.success;
    this.data = res.data;
    this.status = res.status;
    this.message = res.message;
  }
}
