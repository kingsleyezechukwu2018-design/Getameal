import { RouteError } from "configs/errors";
import { MealEntity } from "models/meal/meal.entity";
import { CartItem } from "./carts_types";
import { getUser } from "utils";
import { addMealItemToCart, getCustomerCart } from "./util_cart";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Controller, "CARTS");

export async function addMealToCart({
  customerId,
  mealId,
}: {
  customerId: string;
  mealId: string;
}) {
  try {
    logger.info(`Adding meal to cart for customer`, { customerId, mealId });
    const customer = await getUser(customerId);

    let meal = await MealEntity.getMeal({ id: mealId });
    if (!meal) {
      logger.info(`Meal not found`, { mealId });
      const error = new RouteError("Meal not found.");
      throw error;
    }

    if (meal.availableDate < new Date()) {
      logger.info(`Meal is not available for order`, { mealId });
      const error = new RouteError("Meal is not available for order.");
      throw error;
    }

    if (meal.remainingOrders <= 0) {
      logger.info(`Meal is sold out`, { mealId });
      const error = new RouteError("Meal is sold out.");
      throw error;
    }

    const cart = await getCustomerCart(customer.id);

    const cartItemIndex = (cart as CartItem[]).findIndex(
      (item: CartItem) => item.mealId === meal.id,
    );

    if (cartItemIndex !== -1) {
      (cart as CartItem[])[cartItemIndex].quantity += 1;
      logger.info(`Incremented quantity for meal in cart`, { mealId });
    } else {
      (cart as CartItem[]).push({
        mealId: meal.id,
        cookId: meal.cookId,
        quantity: 1,
        unitPrice: meal.price,
        availableDate: meal.availableDate,
      });
      logger.info(`Added meal to cart`, { mealId });
    }

    await addMealItemToCart({
      customerId: customer.id,
      cart: cart as CartItem[],
    });
    logger.info(`Cart updated for customer`, { customerId });
    return "success";
  } catch (error) {
    logger.error(`Error adding meal to cart: ${error}`);
    throw error;
  }
}

export async function removeMealFromCart({
  customerId,
  mealId,
  shouldDelete,
}: {
  customerId: string;
  mealId: string;
  shouldDelete?: boolean;
}) {
  logger.info(`Removing meal from cart for customer`, { customerId, mealId });
  const customer = await getUser(customerId);

  let meal = await MealEntity.getMeal({ id: mealId });
  if (!meal) {
    logger.info(`Meal not found`, { mealId });
    const error = new RouteError("Meal not found.");
    throw error;
  }

  const cart = await getCustomerCart(customer.id);
  if (!cart.length) {
    const error = new RouteError("Cart is empty.");
    logger.info(`Cart is empty for customer`, { customerId, error });
    throw error;
  }

  const cartItemIndex = (cart as CartItem[]).findIndex(
    (item: CartItem) => item.mealId === meal.id,
  );
  if (cartItemIndex === -1) {
    logger.info(`Meal not found in cart`, { mealId });
    return cart;
  }

  if (shouldDelete || (cart as CartItem[])[cartItemIndex].quantity <= 1) {
    (cart as CartItem[]).splice(cartItemIndex, 1);
    logger.info(`Removed meal from cart`, { mealId });
  } else {
    (cart as CartItem[])[cartItemIndex].quantity -= 1;
    logger.info(`Decremented quantity for meal in cart`, { mealId });
  }

  await addMealItemToCart({
    customerId: customer.id,
    cart: cart as CartItem[],
  });
  logger.info(`Cart updated for customer`, { customerId });

  return "success";
}

export async function getCartItems(customerId: string) {
  logger.info(`Fetching cart items for customer`, { customerId });
  const customer = await getUser(customerId);

  const cart = await getCustomerCart(customer.id);
  logger.info(
    `Fetched ${Array.isArray(cart) ? cart.length : 0} items for customer`,
    { customerId },
  );
  const mealIds = [...new Set((cart as CartItem[]).map((item) => item.mealId))];
  const cartItems = await MealEntity.getMealsByIdsWithDetails(mealIds);
  return cartItems;
}

export async function getCartItem(
  customerId: string,
  mealId: string,
): Promise<CartItem | null> {
  logger.info(`Fetching cart item for customer`, { customerId, mealId });
  const customer = await getUser(customerId);

  let meal = await MealEntity.getMeal({ id: mealId });
  if (!meal) {
    logger.info(`Meal not found`, { mealId });
    const error = new RouteError("Meal not found.");
    throw error;
  }

  const cart = await getCustomerCart(customer.id);
  let item = (cart as CartItem[]).find(
    (cartItem) => cartItem.mealId === mealId,
  );

  logger.info(
    `Fetched cart item: ${item ? JSON.stringify(item) : "not found"}`,
    { customerId, mealId },
  );
  return item;
}
