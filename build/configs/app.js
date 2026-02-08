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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const response_1 = require("../utils/response");
const routes_1 = require("../routes");
const _1 = __importDefault(require("."));
const errors_1 = require("./errors");
const logger_1 = __importStar(require("../utils/logger"));
const app = (0, express_1.default)();
const { allowedOrigins: origin } = _1.default;
const logger = (0, logger_1.default)(logger_1.ModuleType.Config, "app");
app
    .use((0, cors_1.default)({ origin }))
    .use(express_1.default.json({ limit: "10mb" }))
    .use(express_1.default.urlencoded({ limit: "10mb", extended: true }))
    .use((0, helmet_1.default)());
app.get("/", (_req, res) => {
    res.json({ message: "welcome! Testing..." });
});
app
    .use("/v1", routes_1.v1Routes)
    .use((err, _req, res, _next) => {
    // Global error handler
    let error;
    if (err instanceof errors_1.RouteError) {
        error = { message: err.message, statusCode: err.statusCode };
    }
    else {
        error = {
            message: "Something went wrong, try again later",
            statusCode: 500,
        };
    }
    logger.error("Global error caught", { error, err });
    return (0, response_1.handleResponse)({
        res,
        status: error.statusCode,
        data: error,
    });
})
    .use((_req, res) => {
    // Catch-all 404 handler
    logger.info("404 Not Found", { url: _req.originalUrl });
    res.status(404).json({ message: "Not found!" });
});
exports.default = app;
//# sourceMappingURL=app.js.map