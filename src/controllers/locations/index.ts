import { LocationEntity } from "models/location/location.entity";
import geolib from "geolib";
import { formatLocationFromCoords } from "configs/locationLibray/openStreetMap";
import { UserLocationEntity } from "models/userLocations/user_location.entity";
import { RouteError } from "configs/errors";
import createLogger, { ModuleType } from "utils/logger";
import { UserEntity } from "models/users/users.entity";
import { generateAccessToken } from "controllers/auth/util_auth";

const logger = createLogger(ModuleType.Controller, "LOCATIONS");

export async function getAllLocations() {
  logger.info("retrieving all locations", {});

  const locations = await LocationEntity.getLocationsGroupedByState();
  return locations;
}

//Locate me
export async function getLocation(latitude: number, longitude: number) {
  logger.info("retrieving location by coordinates", { latitude, longitude });

  let location = await LocationEntity.findByCoordinates(latitude, longitude);
  if (location) {
    return {
      location: `${location.city}, ${location.state}, ${location.country}`,
    };
  }

  logger.info(
    "location not found by coordinates, preparing location from coordinates",
    { latitude, longitude },
  );
  let res;
  try {
    res = await formatLocationFromCoords(
      latitude.toString(),
      longitude.toString(),
    );
  } catch (error) {
    logger.error("error formatting location from coordinates", { error });
    throw error;
  }

  const { city, state, country } = res;
  logger.info("formatted location from coordinates", { city, state, country });
  location = await LocationEntity.createLocation({
    latitude,
    longitude,
    city,
    state,
    country,
  });

  return {
    location: `${city}, ${state}, ${country}`,
  };
}

export async function addUserLocationAndFullName({
  userId,
  latitude,
  longitude,
  fullName,
}: {
  userId: string;
  latitude: number;
  longitude: number;
  fullName: string;
}) {
  logger.info("add user location request", {
    userId,
    latitude,
    longitude,
    fullName,
  });

  let user = await UserEntity.findByParams({ id: userId });
  if (!user) {
    const error = new RouteError("account not found");
    logger.info("account not found", { userId, error });
    throw error;
  }

  const location = await LocationEntity.findByCoordinates(latitude, longitude);
  if (!location) {
    const error = new RouteError("Location not found");
    logger.info("location not found", { userId, latitude, longitude, error });
    throw error;
  }

  let userLocation = await UserLocationEntity.getLocationByUserId(userId);
  if (userLocation && user.isComplete) {
    const accessToken = generateAccessToken({
      data: { userId: user.id, role: user.role },
    });

    logger.info("user location already exists and account is completed", {
      userId,
    });
    return { accessToken, user };
  }

  if (userLocation) {
    userLocation = await UserLocationEntity.updateUserLocation(
      userId,
      location.id,
    );
  } else {
    userLocation = await UserLocationEntity.create({
      userId,
      locationId: location.id,
    }).save();
  }

  user = await UserEntity.updateUser({ id: user.id }, { fullName, isComplete: true });
  const accessToken = generateAccessToken({
    data: { userId: user.id, role: user.role },
  });

  return { accessToken, user };
}

export async function getUserLocation(userId: string) {
  const userLocation = await UserLocationEntity.getLocationByUserId(userId);
  if (!userLocation) {
    logger.error("user location not found", { userId });
    throw new RouteError("User location not found");
  }

  return userLocation;
}

export async function isWithinRadius(
  userId: string,
  latitude: number,
  longitude: number,
  radiusInMeters: number,
) {
  logger.info("checking if user is within radius", {
    userId,
    latitude,
    longitude,
    radiusInMeters,
  });

  const userLocation = await UserLocationEntity.getLocationByUserId(userId);
  if (!userLocation) {
    logger.error("user location not found", { userId });
    throw new RouteError("User location not found");
  }

  const distance = geolib.getDistance(
    { latitude, longitude },
    {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    },
  );

  return distance <= radiusInMeters;
}
