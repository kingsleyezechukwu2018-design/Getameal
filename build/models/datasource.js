"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const configs_1 = __importDefault(require("../configs"));
const path_1 = require("path");
const { isDev, databaseUri, synchronizeOrm } = configs_1.default;
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: databaseUri,
    ssl: !isDev ? { rejectUnauthorized: false } : false,
    synchronize: isDev && !!synchronizeOrm, // (dev only, don't ever turn on in production!)
    logging: false,
    entities: [(0, path_1.join)(__dirname, "**", "*.entity.{ts,js}")],
    migrations: [(0, path_1.join)(__dirname, "../migrations/*.{ts,js}")],
    //TODO: add cache
});
//# sourceMappingURL=datasource.js.map