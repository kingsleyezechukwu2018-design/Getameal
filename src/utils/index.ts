import { addItem, getItemByKey } from "configs/redis";
import {
  IToken,
  PaginateParams,
  PaginateResult,
  PaginateResultMeta,
} from "./types";
import { InternalError } from "configs/errors";
import { UserEntity } from "models/users/users.entity";
import { AuthEntity } from "models/auth/auth.entity";
import { generateToken } from "controllers/auth/util_auth";
import jwt from "jsonwebtoken";
import appConfig from "configs";

const { jwtRefreshTokenSecret, jwtRefreshTokenExpiresIn } = appConfig;
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

export async function prepareLoginToken(
  user: UserEntity,
  userAuth: AuthEntity,
) {
  const accessToken = generateToken({
    data: { userId: user.id, role: user.role },
  });

  let refreshTokenExpiresAt;
  if (userAuth.refreshToken) {
    const { exp } = jwt.decode(userAuth.refreshToken) as IToken;

    refreshTokenExpiresAt = exp;
  }

  const refreshToken =
    !refreshTokenExpiresAt || refreshTokenExpiresAt < Date.now()
      ? generateToken({
          data: { userId: user.id, role: user.role },
          secret: jwtRefreshTokenSecret,
          expiresIn: jwtRefreshTokenExpiresIn,
        })
      : userAuth.refreshToken;

  await AuthEntity.updateAuth({ id: userAuth.id }, { refreshToken });

  return { accessToken, refreshToken };
}
