import Joi from "joi";

export const addMealToCartSchema = Joi.object({
  mealId: Joi.string().required(),
});

export const removeMealFromCartSchema = Joi.object({
  mealId: Joi.string().required(),
  shouldDelete: Joi.boolean().optional(),
});

export const getMealFromCartSchema = Joi.object({
  mealId: Joi.string().required(),
});