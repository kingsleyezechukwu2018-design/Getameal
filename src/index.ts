import app from "configs/app";
import appConfig from "./configs";
import createLogger, { ModuleType } from "utils/logger";
import { createDbConnection } from "models/dbConnection";
import { populateLocation } from "jobs/one-off/populateLocation";
import "configs/notificationLibrary/firebase";
import { UserEntity } from "models/users/users.entity";
import { AuthEntity, LoginOption } from "models/auth/auth.entity";
import { MealEntity } from "models/meal/meal.entity";
import { DeliveryOption, QuantityUnit } from "models/meal/types_meal_entity";
import { UserRole } from "controllers/users/types_users";

const logger = createLogger(ModuleType.Entry, "ENTRY");

const { port, environment } = appConfig;

(async () => {
  if (!environment) {
    logger.error("Node environment not found");
    process.exit(1);
  }

  logger.info("Starting the server...", {});

  try {
    await createDbConnection();
    logger.info(
      `Connected to getAMeal database in ${environment} environment`,
      {},
    );

    // const user = await UserEntity.find();
    // const Auth = await AuthEntity.find();
    // const meal = await MealEntity.find();

    // console.log("user", user);
    // console.log("Auth", Auth);
    // console.log("meal", meal);
  } catch (error) {
    logger.error(
      `Error connecting to getAMeal database in ${environment} environment`,
      {
        reason: error.message,
        error,
      },
    );
    throw error;
  }

  await populateLocation();

  app.listen(port, () => {
    logger.info(
      `${environment?.toLocaleUpperCase()} is running on port ${port}...`,
      {},
    );
  });
})().catch((error) => {
  logger.error(`Error starting the server: ${error.message}`, { error });
  process.exit(1);
});
