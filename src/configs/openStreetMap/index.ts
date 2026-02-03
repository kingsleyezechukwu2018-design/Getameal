import { axiosApi } from "utils/helpers";

export const formatLocationFromCoords = async (lat: string, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

  const res = await axiosApi(url, "get", { "User-Agent": "GetAMeal Server" });
  console.log("location response:", res);

  const data = await res.json();
  const address = data.address || {};

  const place =
    address.suburb ||
    address.neighbourhood ||
    address.city_district ||
    address.town ||
    address.city;

  const state = address.state;
  const country = address.country;

  return {
    place,
    state,
    country,
  }
};
