import { InternalError, RouteError } from "configs/errors";
import { UserRole } from "controllers/users/types_users";
import { MealEntity } from "models/meal/meal.entity";
import { DeliveryOption, QuantityUnit } from "models/meal/types_meal_entity";
import { UserEntity } from "models/users/users.entity";
import { getUser } from "utils";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Controller, "MEALS");

export async function addMeal(params: {
  cookId: string;
  mealName: string;
  description?: string;
  category: string;
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

  return meal;
}

export async function getAMeal(mealId: string, userId?: string) {
  const user = await getUser(userId);

  const meal = await MealEntity.getMealByIdWithDetails(mealId);
  return meal;
}

export async function getMealsByCook({
  userId,
  cookId,
  count,
}: {
  userId: string;
  cookId?: string;
  count?: number;
}) {
  let criteria = cookId || userId;
  const user = await getUser(criteria);
  let meals: MealEntity[] = [];

  if (!cookId && user.role === UserRole.COOK) {
    meals = await MealEntity.getMeals({ cookId: user.id }, count);
  } else if (cookId) {
    meals = await MealEntity.getMeals({ cookId }, count);
  }
  return meals;
}
