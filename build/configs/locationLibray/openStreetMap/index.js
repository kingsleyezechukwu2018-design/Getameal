"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLocationFromCoords = void 0;
const helpers_1 = require("../../../utils/helpers");
const formatLocationFromCoords = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const res = await (0, helpers_1.axiosApi)(url, "get", {
        headers: { "User-Agent": "GetAMeal/1.0 (getameal@gmail.com)" },
    });
    console.log("location response:", res);
    const address = res.address || {};
    const city = address.city ||
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
exports.formatLocationFromCoords = formatLocationFromCoords;
//# sourceMappingURL=index.js.map