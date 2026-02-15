import { InternalError, RouteError } from "configs/errors";
import { UserRole } from "controllers/users/types_users";
import { MealEntity } from "models/meal/meal.entity";
import {
  Currency,
  DeliveryOption,
  QuantityUnit,
} from "models/meal/types_meal_entity";
import { UserEntity } from "models/users/users.entity";
import { getUser, handlePaginate } from "utils";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Controller, "MEALS");

export async function addMeal(params: {
  cookId: string;
  mealName: string;
  description?: string;
  category: string;
  currency?: Currency;
  price: number;
  quantityValue: number;
  quantityUnit: QuantityUnit;
  imageUrl?: string;
  availableDate: Date;
  maxOrders: number;
  orderDeadline: Date;
  deliveryOption: DeliveryOption;
  deliveryFee?: number;
  pickupAddress?: string;
}) {
  logger.info("adding new meal", { ...params });

  const user = await getUser(params.cookId);

  if (user.role !== UserRole.COOK) {
    const error = new RouteError("Only cooks can add meals");
    logger.info("user is not a cook", { cookId: params.cookId, error });
    throw error;
  }

  const meal = await MealEntity.createMeal({
    ...params,
    remainingOrders: params.maxOrders,
  });
  logger.info("Meal created successfully", { mealId: meal.id });

  return meal;
}

export async function getAMeal(mealId: string, userId?: string) {
  logger.info("Fetching a meal", { mealId, userId });
  const user = await getUser(userId);

  const meal = await MealEntity.getMealByIdWithDetails(mealId);
  logger.info("Fetched meal details", { mealId, found: !!meal });
  return meal;
}

export async function getMealsByCook({
  userId,
  cookId,
  count = 10,
}: {
  userId: string;
  cookId?: string;
  count?: number;
}) {
  logger.info("Fetching meals by cook", { userId, cookId, count });
  let criteria = cookId || userId;

  const user = await getUser(criteria);
  let meals: MealEntity[] = [];

  const { limit } = handlePaginate({ per_page: count });

  if (!cookId && user.role === UserRole.COOK) {
    logger.info("Getting meals for cook user", { cookId: user.id });
    meals = await MealEntity.getMeals({ cookId: user.id }, count);
  } else if (cookId) {
    logger.info("Getting meals for specified cookId", { cookId });
    meals = await MealEntity.getMeals({ cookId }, limit);
  }

  return meals;
}
