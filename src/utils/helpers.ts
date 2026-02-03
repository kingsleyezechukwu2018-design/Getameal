import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { IRequest } from "./types";

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
  fn: (req: Request | IRequest, res: Response, next: NextFunction) => Promise<any>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
