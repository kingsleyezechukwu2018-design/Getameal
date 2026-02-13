import { RouteError } from "configs/errors";
import {
  addItem,
  decrementCount,
  deleteItem,
  getItemByKey,
  reserveStock,
} from "configs/redis";
import { MealEntity } from "models/meal/meal.entity";
import { UserEntity } from "models/users/users.entity";
import { CartItem } from "./carts_types";
import { acquireLock, getUser } from "utils";

export async function addMealToCart({
  customerId,
  mealId,
}: {
  customerId: string;
  mealId: string;
}) {
  const customerLockKey = `lock:cart:${customerId}:meal:${mealId}`;
  const mealLockKey = `lock:meal:${mealId}`;
  try {
    const customer = await UserEntity.findByParams({ id: customerId });
    if (!customer || !customer.isComplete) {
      const error = new RouteError(
        "Please complete your profile before adding items to the cart.",
      );
      throw error;
    }

    try {
      //prevent race conditions: Acquire locks for customer
      await acquireLock(customerLockKey, customerId);
    } catch (error) {
      return;
    }

    let meal = await MealEntity.getMeal({ id: mealId });
    if (!meal) {
      const error = new RouteError("Meal not found.");
      throw error;
    }

    //prevent race conditions: Acquire locks for meal
    await acquireLock(mealLockKey, mealId);

    let itemQuantity = 1;
    const canReserve = await reserveStock(
      meal.id,
      meal.maxOrders,
      itemQuantity,
    );
    if (!canReserve) {
      throw new Error("Meal is out of stock.");
    }

    const cartKey = `cart:${customer.id}`;
    let cart = (await getItemByKey(cartKey)) as any;
    cart = cart ? JSON.parse(cart) : [];

    const existingCartItem = (cart as CartItem[]).find(
      (item: CartItem) => item.mealId === meal.id,
    );

    if (existingCartItem) {
      cart.quantity += itemQuantity;
    } else {
      (cart as CartItem[]).push({
        mealId: meal.id,
        cookId: meal.cookId,
        quantity: itemQuantity,
        unitPrice: meal.price,
        availableDate: meal.availableDate,
      });
    }

    await addItem(cartKey, JSON.stringify(cart), 900); // 15min TTL
  } catch (error) {
    throw error;
  } finally {
    // Release lock
    await Promise.all([deleteItem(customerLockKey), deleteItem(mealLockKey)]);
  }
}

export async function removeMealFromCart(customerId: string, mealId: string) {
  await getUser(customerId);

  let meal = await MealEntity.getMeal({ id: mealId });
  if (!meal) {
    const error = new RouteError("Meal not found.");
    throw error;
  }

  const mealKey = `meal:${mealId}:reserved`;
  const cartKey = `cart:${customerId}`;
  let cart = (await getItemByKey(cartKey)) as any;
  cart = cart ? JSON.parse(cart) : [];

  const itemIndex = (cart as CartItem[]).findIndex(
    (item: CartItem) => item.mealId === mealId,
  );

  if (itemIndex === -1) {
    const error = new RouteError("Item not found in cart.");
    throw error;
  }

  const quantity = cart[itemIndex].quantity;
  cart = (cart as CartItem[]).splice(itemIndex, 1);
  await addItem(cartKey, JSON.stringify(cart), 900);

  await decrementCount(mealKey, quantity);
  const current = await getItemByKey(mealKey);
  if (Number(current) <= 0) {
    await deleteItem(mealKey);
  }
}

export async function getCartItems(customerId: string): Promise<CartItem[]> {
  await getUser(customerId);

  const cartKey = `cart:${customerId}`;
  let cart = (await getItemByKey(cartKey)) as any;
  cart = cart ? JSON.parse(cart) : [];
  return cart as CartItem[];
}

export async function getCartItem(
  customerId: string,
  mealId: string,
): Promise<CartItem | null> {
  await getUser(customerId);

  let meal = await MealEntity.getMeal({ id: mealId });
  if (!meal) {
    const error = new RouteError("Meal not found.");
    throw error;
  }

  const cartKey = `cart:${customerId}`;
  let cart = (await getItemByKey(cartKey)) as any;
  let item: CartItem | null = null;
  if (!cart) {
    return null;
  }

  cart = cart ? JSON.parse(cart) : [];
  item = (cart as CartItem[]).find((cartItem) => cartItem.mealId === mealId);
  return item;
}

//TODO
//remove cart item entity and cart entity definition and move all logic to redis, then create order from redis data when checkout
//

//ensure all items has been paid for before creating order, if not paid, release stock and remove from cart after 15min of adding to cart, also create a cron job to clear expired cart items and release stock every 15min

//when user checkout, create order and order items from cart data, then clear cart data from redis and release stock if order creation failed

//when user remove item from cart, release stock immediately and remove item from cart in redis

//Q:
//if uder add item to cart and not checkout before the order deadline, what do we do ?
