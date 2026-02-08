"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDbConnection = closeDbConnection;
exports.createDbConnection = createDbConnection;
const datasource_1 = require("./datasource");
let connection;
async function closeDbConnection() {
    if (connection && connection.isInitialized) {
        return connection.destroy();
    }
}
async function createDbConnection() {
    await closeDbConnection();
    connection = await datasource_1.AppDataSource.initialize();
    return connection;
}
//# sourceMappingURL=dbConnection.js.map