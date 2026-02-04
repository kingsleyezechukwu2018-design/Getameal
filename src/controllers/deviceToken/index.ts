import { DeviceTokenEntity } from "models/deviceTokens/device_token.entity";
import { DevicePlatform } from "./types_deviceToken";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Controller, "DEVICE_TOKEN");

export async function createDeviceToken({
  userId,
  token,
  platform,
}: {
  userId: string;
  token: string;
  platform: DevicePlatform;
}) {
  logger.info("create device token request", { userId, platform, token });

  let deviceToken = await DeviceTokenEntity.findByParams({ userId, platform });
  if (!deviceToken) {
    logger.info("creating new device token...", { userId, platform, token });
    deviceToken = await DeviceTokenEntity.createDeviceToken({
      userId,
      token,
      platform,
    });
  }

  if (deviceToken.isDeleted) {
    logger.info("updating deleted device token...", { userId, platform, token });
    deviceToken = await DeviceTokenEntity.updateDeviceToken(deviceToken.id, {
      isDeleted: false,
      token,
    });
  }

  return deviceToken;
}
