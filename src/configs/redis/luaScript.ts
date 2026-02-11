export const RESERVE_STOCK_SCRIPT = `
local maxOrders = tonumber(ARGV[1])
local qty = tonumber(ARGV[2])
local reserved = tonumber(redis.call("GET", KEYS[1]) or "0")

if (maxOrders - reserved) >= qty then
  redis.call("INCRBY", KEYS[1], qty)
  return 1
else
  return 0
end
`;