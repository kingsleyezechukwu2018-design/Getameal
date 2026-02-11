import { Request } from "express";

export interface IRequest extends Request, IToken {}

export interface IToken {
  userId: string;
  role?: string;
  exp?: number | undefined;
}

export enum Country {
  NG = "Nigeria",
}

export interface PaginateParams {
  page?: number
  per_page?: number
  sort?: { [key: string]: -1 | 1 };
}

export interface PaginateResultMeta {
  totalPages: number;
  prevPage: number | null;
  currentPage: number;
  nextPage: number | null;
  totalData: number;
}

export interface PaginateResult {
  sort: { [key: string]: -1 | 1 };
  skip: number;
  limit: number;
  meta: (count: number) => PaginateResultMeta;
}