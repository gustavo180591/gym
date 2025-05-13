import { Request, Response, NextFunction } from 'express';

export class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpException) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
  });
}; 