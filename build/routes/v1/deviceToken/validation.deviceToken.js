"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDeviceTokenSchema = void 0;
const types_deviceToken_1 = require("../../../controllers/deviceToken/types_deviceToken");
const joi_1 = __importDefault(require("joi"));
exports.addDeviceTokenSchema = joi_1.default.object({
    token: joi_1.default.string().max(512).required(),
    platform: joi_1.default.string().valid(...Object.values(types_deviceToken_1.DevicePlatform)).required(),
});
//# sourceMappingURL=validation.deviceToken.js.map