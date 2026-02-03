import { Response } from "express";

export type handleResponseArgType = {
  res: Response;
  data?: any;
  status?: number;
};

export const handleResponse = ({
  res,
  data,
  status = 200,
}: handleResponseArgType): Response => {
  return res.status(status).json(data);
};