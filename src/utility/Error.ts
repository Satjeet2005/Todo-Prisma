export interface ErrorType {
  success: boolean;
  message: string;
  status: number;
}

export class APIError extends Error{
  status: number;
  success: boolean

  constructor(error: ErrorType){
    super(error.message)
    this.status = error.status
    this.success = error.success
  }
}
