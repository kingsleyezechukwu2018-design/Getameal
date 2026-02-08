"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locations_1 = require("../../../controllers/locations");
const express_1 = require("express");
const validateInput_1 = require("../../../middlewares/validateInput");
const helpers_1 = require("../../../utils/helpers");
const validation_location_1 = require("./validation.location");
const middlewares_1 = require("../../../middlewares");
const router = (0, express_1.Router)();
router.get("/all", (0, helpers_1.asyncWrapper)(async (req, res, next) => {
    //TODO: add pagination
    const result = await (0, locations_1.getAllLocations)();
    res.json(result);
}));
router.get("/", (0, validateInput_1.validateInput)(validation_location_1.getLocationSchema, "query"), (0, helpers_1.asyncWrapper)(async (req, res, _next) => {
    const { lat, lng } = req.query;
    const result = await (0, locations_1.getLocation)(Number(lat), Number(lng));
    res.json(result);
}));
router.post("/user", (0, validateInput_1.validateInput)(validation_location_1.addUserLocationSchema), (0, helpers_1.asyncWrapper)(async (req, res, _next) => {
    const { lat, lng, fullName, userId } = req.body;
    const result = await (0, locations_1.addUserLocationAndFullName)({
        userId,
        latitude: Number(lat),
        longitude: Number(lng),
        fullName,
    });
    res.json(result);
}));
router.use(middlewares_1.validateJwtToken, middlewares_1.requireAuth);
router.get("/user", (0, helpers_1.asyncWrapper)(async (req, res, _next) => {
    const userId = req.userId;
    const result = await (0, locations_1.getUserLocation)(userId);
    res.json(result);
}));
exports.default = router;
//# sourceMappingURL=index.js.map