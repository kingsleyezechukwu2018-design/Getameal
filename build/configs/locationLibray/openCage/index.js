"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseGeocodeOpenCage = reverseGeocodeOpenCage;
const helpers_1 = require("../../../utils/helpers");
async function reverseGeocodeOpenCage(lat, lng) {
    const res = await (0, helpers_1.axiosApi)("https://api.opencagedata.com/geocode/v1/json", "get", {
        params: {
            q: `${lat},${lng}`,
            key: process.env.OPENCAGE_API_KEY,
            limit: 1,
            language: "en",
        },
    });
    console.log("opencage res: ", res);
    if (!res.length) {
        throw new Error("No location found");
    }
    return res[0];
}
//# sourceMappingURL=index.js.map