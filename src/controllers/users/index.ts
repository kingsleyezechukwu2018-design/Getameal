import createLogger, { ModuleType } from "utils/logger";
import { UserEntity } from "models/users/users.entity";
import { FavouritesEntity } from "models/favourites/favourites.entity";
import { RouteError } from "configs/errors";
import { UserRole } from "./types_users";
import { getUser } from "utils";

const logger = createLogger(ModuleType.Controller, "USERS");

export async function getUserProfile(userId: string) {
  logger.info("retrieving user profile", { userId });

  const user = await UserEntity.getUserByIdWithLocation(userId);
  return user;
}

export async function addFavouriteCook(userId: string, cookId: string) {
  logger.info("adding favourite cook", { userId, cookId });

  const [_user, cook] = await Promise.all([
    getUser(userId),
    getUser(cookId),
  ]);
  
  if (cook.role !== UserRole.COOK) {
    const error = new RouteError("The specified user is not a cook");
    logger.info("specified user is not a cook", { cookId, error });
    throw error;
  }

  const favouriteCook = await FavouritesEntity.getFavourite({ userId, cookId });
  if (favouriteCook) return favouriteCook;

  const newFavourite = await FavouritesEntity.createFavourite({
    userId,
    cookId,
  });
  return newFavourite;
}

export async function removeFavouriteCook(userId: string, cookId: string) {
  logger.info("removing favourite cook", { userId, cookId });

  const deleted = await FavouritesEntity.updateFavourite(
    { userId, cookId, isDeleted: false },
    { isDeleted: true },
  );
  if (!deleted) {
    const error = new RouteError("Favourite cook not found");
    logger.info("favourite cook not found", { userId, cookId, error });
    throw error;
  }

  return { message: "Favourite cook removed successfully" };
}
