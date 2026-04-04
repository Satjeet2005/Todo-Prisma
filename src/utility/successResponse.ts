interface Success<T> {
  success?: boolean;
  message: string;
  data: T;
  status: number;
}

export const successResponse = <T>({data, message, success, status}: Success<T>) => {
  return {
    success: success || true,
    message,
    data,
    status,
  };
};
