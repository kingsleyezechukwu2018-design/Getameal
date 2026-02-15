import { RouteError } from "configs/errors";
import { NextFunction, Response } from "express";
import { UserEntity } from "models/users/users.entity";
import createLogger, { ModuleType } from "utils/logger";
import { IRequest } from "utils/types";

const logger = createLogger(ModuleType.Middleware, "AUTH");

export const requireAuth = async (
  req: IRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) {
      logger.info("no user id found in request, authorization failed", {});
      throw new RouteError("authorization failed");
    }

    const user = await UserEntity.findByParams({ id: req.userId });
    if (!user || !user.isComplete) {
      logger.info("user not found or profile incomplete, authorization failed", { userId: req.userId });
      throw new RouteError("authorization failed");
    }

    next();
  } catch (err) {
    next(err);
  }
};
