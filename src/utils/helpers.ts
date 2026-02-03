import axios from "axios";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateInput =
  (
    schema: Joi.ObjectSchema<any>,
    fieldType: "body" | "params" | "query" = "body",
  ) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      let parsedData;
      if (fieldType === "body") {
        parsedData = schema.validate(req.body);
        req.body = parsedData.value;
      } else if (fieldType === "params") {
        parsedData = schema.validate(req.params);
        req.params = parsedData.value;
      } else if (fieldType === "query") {
        parsedData = schema.validate(req.query);
        req.query = parsedData.value;
      }

      next();
    } catch (err) {
      next(Error(`${err.errors[0].path}: ${err.errors[0].message}`));
    }
  };

export const axiosApi = async (
  url: string,
  method: "get" | "post",
  headers?: { [key: string]: any },
  payload?: string | { [key: string]: any },
): Promise<any> => {
  const { data } = await axios({
    method,
    url,
    ...headers,
    data: payload,
  });

  return data;
};

export const asyncWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
