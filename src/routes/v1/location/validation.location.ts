import Joi from "joi";

export const getLocationSchema = Joi.object({
  lat: Joi.number().required().min(-90).max(90).messages({
    "number.base": "Latitude must be a number",
    "number.min": "Latitude must be greater than or equal to -90",
    "number.max": "Latitude must be less than or equal to 90",
    "any.required": "Latitude is required",
  }),
  lng: Joi.number().required().min(-180).max(180).messages({
    "number.base": "Longitude must be a number",
    "number.min": "Longitude must be greater than or equal to -180",
    "number.max": "Longitude must be less than or equal to 180",
    "any.required": "Longitude is required",
  }),
});

export const addUserLocationSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  lat: Joi.number().required().min(-90).max(90),
  lng: Joi.number().required().min(-180).max(180),
});
