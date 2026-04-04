interface Error {
  success?: boolean;
  message: string;
  status: number;
}

export const errorResponse = ({ status, message, success }: Error) => {
  return {
    success: success || false,
    message,
    status,
  };
};
