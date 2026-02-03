import appConfig from "configs";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IRequest, IToken } from "utils/types";

const { jwtSecret } = appConfig;

export const validateJwtToken = async (
  req: IRequest,
  _res: Response,
  next: NextFunction,
) => {
  let token = req.headers["authorization"] as string;
  token = token?.replace("Bearer ", "");

  if (!token) return next();
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = (decoded as IToken).userId;

    return next();
  } catch (err) {
    if (err.name) {
      if (err.name === "JsonWebTokenError") {
        return next(Error("invalid token"));
      } else if (err.name === "TokenExpiredError") {
        return next(Error("authentication expired. Please login again"));
      }
    }

    next(err);
  }
};
