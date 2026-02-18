import { addItem, getItemByKey } from "configs/redis";
import { redisKeys } from "configs/redis/keys";
import { CartItem } from "./carts_types";

export async function getCustomerCart(customerId: string) {
  const cartKey = redisKeys.cartKey(customerId);

  let cart = (await getItemByKey(cartKey)) as any;
  cart = cart ? JSON.parse(cart) : [];
  return cart;
}

export async function addMealItemToCart({
  customerId,
  cart,
}: {
  customerId: string;
  cart: CartItem[];
}) {
  const cartKey = redisKeys.cartKey(customerId);
  await addItem(cartKey, JSON.stringify(cart));
}
