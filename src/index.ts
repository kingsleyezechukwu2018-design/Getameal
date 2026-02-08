import app from "configs/app";
import appConfig from "./configs";
import createLogger, { ModuleType } from "utils/logger";
import { createDbConnection } from "models/dbConnection";
import { populateLocation } from "jobs/one-off/populateLocation";
// import "configs/notificationLibrary/firebase";

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
