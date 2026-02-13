import { addItem, getItemByKey } from "configs/redis";
import { PaginateParams, PaginateResult, PaginateResultMeta } from "./types";
import { InternalError } from "configs/errors";
import { UserEntity } from "models/users/users.entity";

export const handlePaginate = ({
  page,
  per_page,
  sort,
}: PaginateParams): PaginateResult => {
  let Page: number = page ? Number(page) : 1;
  let perPage: number = per_page ? Number(per_page) : 20;

  const meta = (count: number): PaginateResultMeta => {
    const totalPages: number = Math.ceil(count / perPage);
    const nextPage = Page + 1 <= totalPages ? Page + 1 : null;
    const prevPage = Page > 1 ? Page - 1 : null;

    return {
      totalPages,
      prevPage,
      currentPage: Page,
      nextPage,
      totalData: count,
    };
  };

  return {
    sort,
    skip: Page >= 1 ? (Page - 1) * perPage : 0,
    limit: perPage,
    meta,
  };
};

export async function acquireLock(key: string, value: string) {
  const existingValue = await getItemByKey(key);
  if (existingValue) {
    throw new InternalError("Lock is already acquired.");
  }

  await addItem(key, value, 10); // 10 seconds TTL
  return true;
}


export async function getUser(userId: string) {
  const user = await UserEntity.findByParams({ id: userId });
  if (!user) {
    const error = new InternalError("Account not found");
    throw error;
  }
  return user;
}