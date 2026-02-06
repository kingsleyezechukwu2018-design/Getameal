import "reflect-metadata";
import { DataSource } from "typeorm";
// import { User } from "./entities/User";
import appConfig from "../configs";
import { join } from "path";

const { isDev, databaseUri, synchronizeOrm } = appConfig;
console.log("path: ", join(__dirname, "../migrations"));

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUri,
  ssl: !isDev ? { rejectUnauthorized: false } : false,
  synchronize: isDev && !!synchronizeOrm, // (dev only, don't ever turn on in production!)
  logging: false,
  entities: [join(__dirname, "**", "*.entity.{ts,js}")],
  migrations: [join(__dirname, "../migrations", "*.{ts,js}")],
  //TODO: add cache
});
