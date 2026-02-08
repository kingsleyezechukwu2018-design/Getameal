import "reflect-metadata";
import { DataSource } from "typeorm";
import appConfig from "configs";
import { join } from "path";

const { isDev, databaseUri, synchronizeOrm } = appConfig;

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUri,
  ssl: !isDev ? { rejectUnauthorized: false } : false,
  synchronize: isDev && !!synchronizeOrm, // (dev only, don't ever turn on in production!)
  logging: false,
  entities: [join(__dirname, "**", "*.entity.{ts,js}")],
  migrations: [join(__dirname,"../migrations/*.{ts,js}")],
  //TODO: add cache
});
