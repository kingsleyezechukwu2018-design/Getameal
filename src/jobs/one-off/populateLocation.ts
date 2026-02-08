import { createReadStream } from "fs";
import csvParser from "csv-parser";
import { LocationEntity } from "models/location/location.entity";
import createLogger, { ModuleType } from "utils/logger";
import path from "path";

const logger = createLogger(ModuleType.Job, "PopulateLocation");
const csvFilePath = path.join(__dirname, "../../../locations.csv");

export async function populateLocation() {
  const locations = await LocationEntity.find();
  if (locations.length) {
    return;
  }

  logger.info("Populating Location data from CSV...", {});
  createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", async (row) => {
      await LocationEntity.createLocation({
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        country: row.country,
        state: row.state,
        city: row.city,
      });
    })
    .on("end", () => {
      logger.info("CSV file successfully processed for Locations", {});
    })
    .on("error", (error) => {
      logger.error(
        `Error processing CSV file for Locations: ${error.message}`,
        {
          error,
        },
      );
      throw error;
    });
}
