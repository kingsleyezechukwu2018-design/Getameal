"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLocations = getAllLocations;
exports.getLocation = getLocation;
exports.addUserLocationAndFullName = addUserLocationAndFullName;
exports.getUserLocation = getUserLocation;
exports.isWithinRadius = isWithinRadius;
const location_entity_1 = require("../../models/location/location.entity");
const geolib_1 = __importDefault(require("geolib"));
const openStreetMap_1 = require("../../configs/locationLibray/openStreetMap");
const user_location_entity_1 = require("../../models/userLocations/user_location.entity");
const errors_1 = require("../../configs/errors");
const logger_1 = __importStar(require("../../utils/logger"));
const users_entity_1 = require("../../models/users/users.entity");
const util_auth_1 = require("../../controllers/auth/util_auth");
const logger = (0, logger_1.default)(logger_1.ModuleType.Controller, "LOCATIONS");
async function getAllLocations() {
    logger.info("retrieving all locations", {});
    const locations = await location_entity_1.LocationEntity.getLocationsGroupedByState();
    return locations;
}
//Locate me
async function getLocation(latitude, longitude) {
    logger.info("retrieving location by coordinates", { latitude, longitude });
    let location = await location_entity_1.LocationEntity.findByCoordinates(latitude, longitude);
    if (location) {
        return {
            location: `${location.city}, ${location.state}, ${location.country}`,
        };
    }
    logger.info("location not found by coordinates, preparing location from coordinates", { latitude, longitude });
    let res;
    try {
        res = await (0, openStreetMap_1.formatLocationFromCoords)(latitude.toString(), longitude.toString());
    }
    catch (error) {
        logger.error("error formatting location from coordinates", { error });
        throw error;
    }
    const { city, state, country } = res;
    logger.info("formatted location from coordinates", { city, state, country });
    location = await location_entity_1.LocationEntity.createLocation({
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
async function addUserLocationAndFullName({ userId, latitude, longitude, fullName, }) {
    logger.info("add user location request", {
        userId,
        latitude,
        longitude,
        fullName,
    });
    let user = await users_entity_1.UserEntity.findByParams({ id: userId });
    if (!user) {
        const error = new errors_1.RouteError("account not found");
        logger.info("account not found", { userId, error });
        throw error;
    }
    const location = await location_entity_1.LocationEntity.findByCoordinates(latitude, longitude);
    if (!location) {
        const error = new errors_1.RouteError("Location not found");
        logger.info("location not found", { userId, latitude, longitude, error });
        throw error;
    }
    let userLocation = await user_location_entity_1.UserLocationEntity.getLocationByUserId(userId);
    if (userLocation && user.isComplete) {
        const accessToken = (0, util_auth_1.generateAccessToken)({
            data: { userId: user.id, role: user.role },
        });
        logger.info("user location already exists and account is completed", {
            userId,
        });
        return { accessToken, user };
    }
    if (userLocation) {
        userLocation = await user_location_entity_1.UserLocationEntity.updateUserLocation(userId, location.id);
    }
    else {
        userLocation = await user_location_entity_1.UserLocationEntity.create({
            userId,
            locationId: location.id,
        }).save();
    }
    user = await users_entity_1.UserEntity.updateUser({ id: user.id }, { fullName, isComplete: true });
    const accessToken = (0, util_auth_1.generateAccessToken)({
        data: { userId: user.id, role: user.role },
    });
    return { accessToken, user };
}
async function getUserLocation(userId) {
    const userLocation = await user_location_entity_1.UserLocationEntity.getLocationByUserId(userId);
    if (!userLocation) {
        logger.error("user location not found", { userId });
        throw new errors_1.RouteError("User location not found");
    }
    return userLocation;
}
async function isWithinRadius(userId, latitude, longitude, radiusInMeters) {
    logger.info("checking if user is within radius", {
        userId,
        latitude,
        longitude,
        radiusInMeters,
    });
    const userLocation = await user_location_entity_1.UserLocationEntity.getLocationByUserId(userId);
    if (!userLocation) {
        logger.error("user location not found", { userId });
        throw new errors_1.RouteError("User location not found");
    }
    const distance = geolib_1.default.getDistance({ latitude, longitude }, {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
    });
    return distance <= radiusInMeters;
}
//# sourceMappingURL=index.js.map