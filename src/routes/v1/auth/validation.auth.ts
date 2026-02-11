import Joi from "joi";

export const emailSignUpSchema = Joi.object({
  email: Joi.string().email().required()
});

export const emailLoginSchema = Joi.object({
  email: Joi.string().email().required()
});

export const googleAuthSchema = Joi.object({
  googleToken: Joi.string().required()
});

export const refreshTokenSchema = Joi.object({
  userId: Joi.string().required()
});