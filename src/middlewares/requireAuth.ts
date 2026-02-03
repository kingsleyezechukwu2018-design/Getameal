import { RouteError } from "configs/errors";
import { NextFunction, Response } from "express";
import { UserEntity } from "models/users/users.entity";
import { IRequest } from "utils/types";

export const requireAuth = async (
  req: IRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) {
      throw new RouteError("authorization failed");
    }

    const user = await UserEntity.findByParams({ id: req.userId });
    if (!user) {
      throw new RouteError("authorization failed");
    }

    next();
  } catch (err) {
    next(err);
  }
};

