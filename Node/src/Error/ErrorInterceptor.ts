import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from './AppError';

export function ErrorInterceptor(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      status: 'Validation Error',
      message: error.issues,
    });
  }

  if (process.env.NODE_ENV === 'development') console.error(error);

  return response.status(500).json({
    status: 'Error',
    message: 'Internal Server Error',
  });
}
