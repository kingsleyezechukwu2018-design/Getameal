import { OtpType } from "controllers/otp/types_otp";
import Joi from "joi";

export const resendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  type: Joi.string()
    .valid(...Object.values(OtpType))
    .required(),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  type: Joi.string()
    .valid(...Object.values(OtpType))
    .required(),
  code: Joi.string().length(6).required(),
});
