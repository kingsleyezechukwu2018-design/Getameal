import { Request } from "express";

export interface IRequest extends Request, IToken {}

export interface IToken {
  userId: string;
  role?: string;
}

export enum Country {
  NG = "Nigeria",
}
