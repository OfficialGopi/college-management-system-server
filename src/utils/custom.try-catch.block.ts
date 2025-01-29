import { NextFunction, Request, Response } from "express";
import { funcType } from "../types/funcType.js";

export const TryCatch =
  (fn: funcType) => async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
