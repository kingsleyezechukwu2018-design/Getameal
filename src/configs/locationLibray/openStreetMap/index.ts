import { axiosApi } from "utils/helpers";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Config, "OpenStreetMap");


export const formatLocationFromCoords = async (lat: string, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

  const res = await axiosApi(url, "get", {
    headers: { "User-Agent": "GetAMeal/1.0 (getameal@gmail.com)" },
  });
  logger.info("location response from OpenStreetMap", { res });

  const address = res.address || {};

  const city =
    address.city ||
    address.suburb ||
    address.neighbourhood ||
    address.city_district ||
    address.town;

  const state = address.state;
  const country = address.country;

  return {
    city,
    state,
    country,
  };
};
