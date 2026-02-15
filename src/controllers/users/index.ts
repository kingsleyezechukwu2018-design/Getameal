import createLogger, { ModuleType } from "utils/logger";
import { UserEntity } from "models/users/users.entity";
import { FavouritesEntity } from "models/favourites/favourites.entity";
import { RouteError } from "configs/errors";
import { UserRole } from "./types_users";
import { getUser } from "utils";
import { LoginOption } from "models/auth/auth.entity";
import { LocationEntity } from "models/location/location.entity";
import { UserLocationEntity } from "models/userLocations/user_location.entity";
import { completedUserLoginResponse } from "controllers";

const logger = createLogger(ModuleType.Controller, "USERS");

export async function getUserProfile(userId: string) {
  logger.info("retrieving user profile", { userId });

  const user = await UserEntity.getUserByIdWithLocation(userId);
  return user;
}

export async function addFavouriteCook(userId: string, cookId: string) {
  logger.info("adding favourite cook", { userId, cookId });

  const [_user, cook] = await Promise.all([getUser(userId), getUser(cookId)]);

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
  const [_user, cook] = await Promise.all([getUser(userId), getUser(cookId)]);

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

export async function completeUserProfile({
  userId,
  latitude,
  longitude,
  fullName,
  loginOption,
  phoneNumber,
  countryCode,
}: {
  userId: string;
  latitude: number;
  longitude: number;
  fullName: string;
  loginOption: LoginOption;
  phoneNumber: string;
  countryCode: string;
}) {
  logger.info("complete user profile request", {
    userId,
    latitude,
    longitude,
    fullName,
    loginOption,
    phoneNumber,
    countryCode,
  });

  let user = await getUser(userId);

  const location = await LocationEntity.findByCoordinates(latitude, longitude);
  if (!location) {
    const error = new RouteError("Location not found");
    logger.info("location not found", { userId, latitude, longitude, error });
    throw error;
  }
  logger.info("Location found for user", { userId, locationId: location.id });

  let userLocation = await UserLocationEntity.getLocationByUserId(userId);
  logger.info("Fetched user location", { userId, userLocation });
  if (userLocation && user.isComplete) {
    logger.info("User profile already complete, returning login response", {
      userId,
    });
    const response = await completedUserLoginResponse(user, loginOption);
    return response;
  }

  if (userLocation) {
    logger.info("Updating existing user location", {
      userId,
      locationId: location.id,
    });
    userLocation = await UserLocationEntity.updateUserLocation(
      userId,
      location.id,
    );
  } else {
    logger.info("Creating new user location", {
      userId,
      locationId: location.id,
    });
    userLocation = await UserLocationEntity.create({
      userId,
      locationId: location.id,
    }).save();
  }

  logger.info("Updating user profile to complete", { userId });
  user = await UserEntity.updateUser(
    { id: user.id },
    {
      fullName,
      phoneNumber,
      phoneNumberCountryCode: countryCode,
      isComplete: true,
    },
  );
  logger.info("User profile updated, returning completed login response", {});
  const response = await completedUserLoginResponse(user, loginOption);

  return response;
}
