import { LocationEntity } from "models/location/location.entity";
import geolib from "geolib";
import { formatLocationFromCoords } from "configs/locationLibray/openStreetMap";
import { UserLocationEntity } from "models/userLocations/user_location.entity";
import { InternalError, RouteError } from "configs/errors";
import createLogger, { ModuleType } from "utils/logger";
import { getUser, handlePaginate } from "utils";

const logger = createLogger(ModuleType.Controller, "LOCATIONS");

export async function getAllLocations({
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
}) {
  logger.info("retrieving all locations", { page, per_page });

  const { skip, limit } = handlePaginate({ page, per_page });

  let locations;
  try {
    locations = await LocationEntity.getLocationsGroupedByState({
      skip,
      limit,
    });
  } catch (error) {
    logger.error("error retrieving all locations", { error });
    throw error;
  }

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

export async function getUserLocation(userId: string) {
  const userLocation = await UserLocationEntity.getLocationByUserId(userId);
  if (!userLocation) {
    logger.error("user location not found", { userId });
    throw new RouteError("User location not found");
  }

  return userLocation;
}

// export async function isWithinRadius(
//   userId: string,
//   latitude: number,
//   longitude: number,
//   radiusInMeters: number,
// ) {
//   logger.info("checking if user is within radius", {
//     userId,
//     latitude,
//     longitude,
//     radiusInMeters,
//   });

//   const userLocation = await UserLocationEntity.getLocationByUserId(userId);
//   if (!userLocation) {
//     logger.error("user location not found", { userId });
//     throw new RouteError("User location not found");
//   }

//   const distance = geolib.getDistance(
//     { latitude, longitude },
//     {
//       latitude: userLocation.latitude,
//       longitude: userLocation.longitude,
//     },
//   );

//   return distance <= radiusInMeters;
// }

export const getCooks = async ({
  userId,
  lat,
  lng,
  count,
}: {
  userId: string;
  lat?: number;
  lng?: number;
  count?: number;
}) => {
  const user = await getUser(userId);

  const location = await UserLocationEntity.getLocationByUserId(user.id);
  if (!location) {
    const error = new InternalError("User location not found");
    logger.info("user location not found", { userId });
    throw error;
  }

  lat = lat || location.latitude;
  lng = lng || location.longitude;
  const cooks = await LocationEntity.getCooksByLocation(lat, lng, count);
  return cooks;
};
