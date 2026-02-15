import Joi from "joi";
import { Currency, DeliveryOption, QuantityUnit } from "models/meal/types_meal_entity";

export const getAMealSchema = Joi.object({
  mealId: Joi.string().required(),
});

export const getMealsByCookIdSchema = Joi.object({
  cookId: Joi.string().optional(),
  count: Joi.number().optional(),
});

export const addAMealByCookIdSchema = Joi.object({
  mealName: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  currency: Joi.string().valid(...Object.values(Currency)).optional(),
  quantityValue: Joi.number().required(),
  quantityUnit: Joi.string().valid(...Object.values(QuantityUnit)).required(),
  imageUrl: Joi.string().uri().optional(),
  availableDate: Joi.date().iso().required(),
  maxOrders: Joi.number().required(),
  orderDeadline: Joi.date().iso().required(),
  deliveryOption: Joi.string().valid(...Object.values(DeliveryOption)).required(),
  deliveryFee: Joi.number().when("deliveryOption", {
    is: Joi.valid(DeliveryOption.DELIVERY, DeliveryOption.BOTH),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  pickupAddress: Joi.string().when("deliveryOption", {
    is: Joi.valid("pickup", "both"),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});
