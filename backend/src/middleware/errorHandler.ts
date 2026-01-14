import type { NextFunction, Request, Response } from "../types/express";

export function notFound(req: Request, res: Response, next: NextFunction) {
  (res as any).status(404);
  (next as any)(new Error(`Not Found - ${(req as any).originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = (res as any).statusCode === 200 ? 500 : (res as any).statusCode;
  (res as any).status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}


