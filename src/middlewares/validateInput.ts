import { RouteError } from "configs/errors";
import { NextFunction, Response, Request } from "express";
import Joi from "joi";

export const validateInput =
  (
    schema: Joi.ObjectSchema<any>,
    fieldType: "body" | "params" | "query" = "body",
  ) =>
  (req: Request, _res: Response, next: NextFunction) => {
    let parsedData;
    if (fieldType === "body") {
      parsedData = schema.validate(req.body);
    } else if (fieldType === "params") {
      parsedData = schema.validate(req.params);
    } else if (fieldType === "query") {
      parsedData = schema.validate(req.query);
    }

    const { error, value } = parsedData;
    if (error) {
      const message = error.details
        .map((d) => d.message)
        .join(", ")
        .replace(/"/g, "");
      return next(new RouteError(message, 400));
    }

    req[fieldType] = value;
    next();
  };
