export const redisKeys = {
  cartKey: (customerId: string) => `cart:${customerId}`,
};
