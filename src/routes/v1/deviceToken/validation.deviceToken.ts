import { DevicePlatform } from "controllers/deviceToken/types_deviceToken";
import Joi from "joi";

export const addDeviceTokenSchema = Joi.object({
  token: Joi.string().max(512).required(),
  platform: Joi.string().valid(...Object.values(DevicePlatform)).required(),
});