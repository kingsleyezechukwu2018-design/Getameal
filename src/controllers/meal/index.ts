import { RouteError } from "configs/errors";
import { uploadImage } from "configs/fileStorage";
import { UserRole } from "controllers/users/types_users";
import { sendNewMealPushNotification } from "jobs/queue";
import { MealEntity } from "models/meal/meal.entity";
import {
  Currency,
  DeliveryOption,
  QuantityUnit,
} from "models/meal/types_meal_entity";
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
  logger.info("Meal created successfully, sending push notification", { mealId: meal.id });

  try {
    await sendNewMealPushNotification({ mealId: meal.id, cookId: meal.cookId });
  } catch (error) {
    logger.error("Error sending push notification", {
      mealId: meal.id,
      cookId: meal.cookId,
      error,
    });
    throw error;
  }

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

export async function uploadMealImage({
  userId,
  file,
  publicId,
}: {
  userId: string;
  file: Express.Multer.File;
  publicId?: string;
}) {
  logger.info("Uploading image for meal", { userId });
  await getUser(userId);

  try {
    const result = await uploadImage({
      folderName: "meal-images",
      file,
      resourceType: "image",
      ...(publicId && { publicId }),
    });

    logger.info("Image uploaded successfully", { userId, result });
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      metadata: result,
    };
  } catch (error) {
    logger.error("Error uploading image for meal", { userId, error });
    throw error;
  }
}

//save to mealEntity like this
//image: {imageUrl, publicId, metadata}
