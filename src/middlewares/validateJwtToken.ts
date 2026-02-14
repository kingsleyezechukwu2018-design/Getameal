import appConfig from "configs";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import createLogger, { ModuleType } from "utils/logger";
import { IRequest, IToken } from "utils/types";

const { jwtAccessTokenSecret } = appConfig;
const logger = createLogger(ModuleType.Middleware, "AUTH");

export const validateJwtToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers["authorization"] as string;
  token = token?.replace("Bearer ", "");

  if (!token) return next();
  try {
    const decoded = jwt.verify(token, jwtAccessTokenSecret);
    req.userId = (decoded as IToken).userId;

    logger.info("decoded token", { decoded });
    return next();
  } catch (err) {
    logger.error("error validating jwt token", { err });

    if (err.name) {
      if (err.name === "JsonWebTokenError") {
        res.status(401).json({ message: "invalid token" });
        return next({ message: "invalid token" });
      } else if (err.name === "TokenExpiredError") {
        res
          .status(401)
          .json({ message: "You have been logged out. Please login again" });
        return next({ message: "authentication expired. Please login again" });
      }
    }

    next({ message: err.message || "Authentication error" });
  }
};
