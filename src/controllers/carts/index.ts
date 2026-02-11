import { RouteError } from "configs/errors";
import { addItemWithTTL, deleteItem, getItemByKey, reserveStock } from "configs/redis";
import { MealEntity } from "models/meal/meal.entity";
import { UserEntity } from "models/users/users.entity";
import { CartItem } from "./carts_types";

export async function addToCart({
  customerId,
  mealId,
}: {
  customerId: string;
  mealId: string;
}) {
  const customer = await UserEntity.findByParams({ id: customerId });
  if (!customer || !customer.isComplete) {
    const error = new RouteError(
      "Please complete your profile before adding items to the cart.",
    );
    throw error;
  }

  let meal = await MealEntity.getMeal({ id: mealId });
  if (!meal) {
    const error = new RouteError("Meal not found.");
    throw error;
  }

  let itemQuantity = 1;
  const canReserve = await reserveStock(meal.id, meal.maxOrders, itemQuantity);
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

  await addItemWithTTL(cartKey, JSON.stringify(cart), 900); // 15min TTL
}

export async function removeFromCart(customerId: string, mealId: string) {
  const key = `meal:${mealId}:reserved`;

  await redis.decrby(key, quantity);

  const current = await deleteItem(key);
  if (Number(current) <= 0) {
    await redis.del(key);
  }

  // Also remove from cart logic in Redis
  const cartKey = `cart:${customerId}`;
  let cart = (await getItemByKey(cartKey)) as any;
  cart = cart ? JSON.parse(cart) : [];

  const itemIndex = (cart as CartItem[]).findIndex(
    (item: CartItem) => item.mealId === mealId,
  );

  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
    await addItemWithTTL(cartKey, JSON.stringify(cart), 900); // 15min TTL
  }
}

//TODO
//remove cart item entity and cart entity definition and move all logic to redis, then create order from redis data when checkout
//
