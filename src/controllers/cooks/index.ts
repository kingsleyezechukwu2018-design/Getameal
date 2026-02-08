import { InternalError, RouteError } from "configs/errors";
import { UserLocationEntity } from "models/userLocations/user_location.entity";
import { UserEntity } from "models/users/users.entity";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Controller, "COOKS");

export const getCooksNearby = async (userId: string) => {
  const user = await UserEntity.findByParams({ id: userId });
  if (!user) {
    const error = new InternalError("User not found");
    logger.info("user not found", { userId });
    throw error;
  }

  const location = await UserLocationEntity.getLocationByUserId(user.id);
  if (!location) {
    const error = new InternalError("User location not found");
    logger.info("user location not found", { userId });
    throw error;
  }

  const cooks = await UserLocationEntity.getCooksNearby(
    location.latitude,
    location.longitude,
  );
  return cooks;
};
