import { DataSource } from "typeorm";
import * as config from "./datasource";

let connection: DataSource;

export async function closeDbConnection(): Promise<void> {
  if (connection && connection.isInitialized) {
    return connection.destroy();
  }
}

export async function createDbConnection(): Promise<DataSource> {
  await closeDbConnection();
  connection = await config.AppDataSource.initialize();
  return connection;
}
