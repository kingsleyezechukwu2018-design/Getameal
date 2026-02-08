"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserLocationSchema = exports.getLocationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.getLocationSchema = joi_1.default.object({
    lat: joi_1.default.number().required().min(-90).max(90).messages({
        "number.base": "Latitude must be a number",
        "number.min": "Latitude must be greater than or equal to -90",
        "number.max": "Latitude must be less than or equal to 90",
        "any.required": "Latitude is required",
    }),
    lng: joi_1.default.number().required().min(-180).max(180).messages({
        "number.base": "Longitude must be a number",
        "number.min": "Longitude must be greater than or equal to -180",
        "number.max": "Longitude must be less than or equal to 180",
        "any.required": "Longitude is required",
    }),
});
exports.addUserLocationSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
    lat: joi_1.default.number().required().min(-90).max(90),
    lng: joi_1.default.number().required().min(-180).max(180),
    fullName: joi_1.default.string()
});
//# sourceMappingURL=validation.location.js.map