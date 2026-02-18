import Redis from "ioredis";
import { RESERVE_STOCK_SCRIPT } from "./luaScript";
import appConfig from "configs";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Config, "REDIS");

const { redisUrl } = appConfig;

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  logger.info("Redis connected", {});
});

redis.on("error", (err) => {
  logger.error("Redis error:", { error: err });
});

export async function reserveStock(
  mealId: string,
  maxOrders: number,
  quantity: number,
): Promise<boolean> {
  const key = `meal:${mealId}:reserved`;

  const result = await redis.eval(
    RESERVE_STOCK_SCRIPT,
    1,
    key,
    maxOrders,
    quantity,
  );

  return result === 1;
}

export async function releaseStock(
  mealId: string,
  quantity: number,
): Promise<void> {
  const key = `meal:${mealId}:reserved`;
  await redis.decrby(key, quantity);
}

export async function getReservedStock(mealId: string): Promise<number> {
  const key = `meal:${mealId}:reserved`;
  const reserved = await redis.get(key);
  return reserved ? parseInt(reserved, 10) : 0;
}

export async function getItemByKey(key: string): Promise<string | null> {
  return redis.get(key);
}

export async function addItem(
  key: string,
  value: string,
  ttlSeconds?: number,
): Promise<void> {
  if (ttlSeconds) {
    await redis.set(key, value, "EX", ttlSeconds);
  } else {
    await redis.set(key, value);
  }
}

export async function deleteItem(key: string): Promise<void> {
  await redis.del(key);
}

export async function decrementCount(
  key: string,
  quantity: number,
): Promise<void> {
  await redis.decrby(key, quantity);
}
