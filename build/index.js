"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./configs/app"));
const configs_1 = __importDefault(require("./configs"));
const logger_1 = __importStar(require("./utils/logger"));
const dbConnection_1 = require("./models/dbConnection");
// import "./configs/notificationLibrary/firebase";
const logger = (0, logger_1.default)(logger_1.ModuleType.Entry, "ENTRY");
const { port, environment } = configs_1.default;
(async () => {
    if (!environment) {
        logger.error("Node environment not found");
        process.exit(1);
    }
    logger.info("Starting the server...", {});
    try {
        await (0, dbConnection_1.createDbConnection)();
        logger.info(`Connected to getAMeal database in ${environment} environment`, {});
    }
    catch (error) {
        logger.error(`Error connecting to getAMeal database in ${environment} environment`, {
            reason: error.message,
            error,
        });
        throw error;
    }
    app_1.default.listen(port, () => {
        logger.info(`${environment?.toLocaleUpperCase()} is running on port ${port}...`, {});
    });
})().catch((error) => {
    logger.error(`Error starting the server: ${error.message}`, { error });
    process.exit(1);
});
//# sourceMappingURL=index.js.map