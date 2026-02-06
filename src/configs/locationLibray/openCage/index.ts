import { axiosApi } from "utils/helpers";

export async function reverseGeocodeOpenCage(lat: number, lng: number) {
  const res = await axiosApi(
    "https://api.opencagedata.com/geocode/v1/json",
    "get",
    {
      params: {
        q: `${lat},${lng}`,
        key: process.env.OPENCAGE_API_KEY,
        limit: 1,
        language: "en",
      },
    },
  );
  console.log("opencage res: ", res);

  if (!res.length) {
    throw new Error("No location found");
  }

  return res[0];
}
