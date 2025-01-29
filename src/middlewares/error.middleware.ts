import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api.error.js";

export const errorMiddleware = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.status ||= 500;
  error.success ||= false;
  error.message ||= "Internal Server Error";
  res.status(error.status).json({
    status: error.status,
    success: error.success,
    message: error.message,
    // error: error.errors,
    // stack: error.stack,
    // cause: error.cause,
  });
};
