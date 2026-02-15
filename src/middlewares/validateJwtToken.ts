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
  logger.info("validating jwt token for incoming request", {});
  let token = req.headers["authorization"] as string;
  token = token?.replace("Bearer ", "");

  if (!token) return next();
  logger.info("found token, validating...", {});
  try {
    const decoded = jwt.verify(token, jwtAccessTokenSecret);
    req.userId = (decoded as IToken).userId;
    req.role = (decoded as IToken).role;

    logger.info("decoded token", { decoded });
    return next();
  } catch (err) {
    logger.error("error validating jwt token", { err });

    if (err.name) {
      if (err.name === "JsonWebTokenError") {
        logger.error("invalid jwt token", { error: err });
        return next({ message: "invalid token" });
      } else if (err.name === "TokenExpiredError") {
        logger.error("jwt token expired", { error: err });
        return next({ message: "authentication expired" });
      }
    }

    next({ message: err.message || "Authentication error" });
  }
};
