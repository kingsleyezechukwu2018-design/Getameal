import { RouteError } from "configs/errors";
import { UserRole } from "controllers/users/types_users";
import { NextFunction, Response } from "express";
import createLogger, { ModuleType } from "utils/logger";
import { IRequest } from "utils/types";

const logger = createLogger(ModuleType.Middleware, "AUTH");
export const ensureUserIsACook = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info("checking if user is a cook", {
      userId: req.userId,
      role: req.role,
    });

    if (!req.role || req.role !== UserRole.COOK) {
      logger.info("user is not a cook", { userId: req.userId, role: req.role });
      throw new RouteError("user is not a cook");
    }

    next();
  } catch (err) {
    next(err);
  }
};
