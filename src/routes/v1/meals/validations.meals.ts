import Joi from "joi";

export const getAMealSchema = Joi.object({
  mealId: Joi.string().required(),
});

export const getMealsByCookIdSchema = Joi.object({
  cookId: Joi.string().optional(),
  count: Joi.number().optional(),
});
