import { DeviceTokenEntity } from "models/deviceTokens/device_token.entity";

export async function batchPushNotification(
  notificationHandler: (tokens: string[]) => Promise<void>,
) {
  let hasMoreTokens = true;
  let offset = 0;
  const BATCH_SIZE = 400;

  let tokens;
  while (hasMoreTokens) {
    tokens = await DeviceTokenEntity.getTokens(offset, BATCH_SIZE);

    if (tokens.length === 0) {
      hasMoreTokens = false;
      break;
    }

    await notificationHandler(tokens);

    //sleep for a short duration
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms delay
    offset += BATCH_SIZE;
  }
}
