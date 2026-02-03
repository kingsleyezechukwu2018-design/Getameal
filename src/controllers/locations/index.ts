import { LocationEntity } from "models/location/location.entity";
import geolib from "geolib";
import { formatLocationFromCoords } from "configs/openStreetMap";
import { UserLocationEntity } from "models/userLocations/user_location.entity";
import { RouteError } from "configs/errors";

export async function getAllLocations() {
  const locations = await LocationEntity.getLocationsGroupedByState();
  return locations;
}

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
  const location = await LocationEntity.findByCoordinates(latitude, longitude);
  if (!location) {
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
  const userLocation = await UserLocationEntity.getLocationByUserId(userId);
  if (!userLocation) {
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
