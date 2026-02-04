import { LocationEntity } from "models/location/location.entity";
import geolib from "geolib";
import { formatLocationFromCoords } from "configs/openStreetMap";
import { UserLocationEntity } from "models/userLocations/user_location.entity";
import { RouteError } from "configs/errors";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Controller, "LOCATIONS");

export async function getAllLocations() {
  logger.info("retrieving all locations", {});

  const locations = await LocationEntity.getLocationsGroupedByState();
  return locations;
}

//TODO:Improve this function
//update payload to take place, state, country instead of latitude and longitude
//if location exist by place, state, country return that
// else
//-find location by place state country
// -create new location
export async function getLocation(latitude: number, longitude: number) {
  let location = await LocationEntity.findByCoordinates(latitude, longitude);
  if (location) {
    return {
      location: `${location.place}, ${location.state}, ${location.country}`,
    };
  }

  const { place, state, country } = await formatLocationFromCoords(
    latitude.toString(),
    longitude.toString(),
  );

  location = await LocationEntity.createLocation({
    latitude,
    longitude,
    place,
    state,
    country,
  });

  return {
    location: `${place}, ${state}, ${country}`,
  };
}

export async function addUserLocation(
  userId: string,
  latitude: number,
  longitude: number,
) {
  logger.info("adding user location", { userId, latitude, longitude });
  const location = await LocationEntity.findByCoordinates(latitude, longitude);
  if (!location) {
    logger.error("location not found", { userId, latitude, longitude });
    throw new RouteError("Location not found");
  }

  const userLocation = await UserLocationEntity.create({
    userId,
    locationId: location.id,
  }).save();

  return userLocation;
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
