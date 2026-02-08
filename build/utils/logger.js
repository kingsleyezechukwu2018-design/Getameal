"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleType = void 0;
const winston_1 = __importDefault(require("winston"));
var ModuleType;
(function (ModuleType) {
    ModuleType["Controller"] = "CONTROLLER";
    ModuleType["Service"] = "SERVICE";
    ModuleType["Model"] = "MODEL";
    ModuleType["Repository"] = "REPOSITORY";
    ModuleType["Route"] = "ROUTE";
    ModuleType["Util"] = "UTIL";
    ModuleType["Job"] = "JOB";
    ModuleType["Config"] = "CONFIG";
    ModuleType["Entry"] = "ENTRY";
    ModuleType["Middleware"] = "MIDDLEWARE";
})(ModuleType || (exports.ModuleType = ModuleType = {}));
function format(mod, feature, text) {
    return `[${mod}:${feature}] ${text}`;
}
const logLevel = "info"; //NOTE: this should come from config file
const createLogger = (mod, feature) => {
    const levels = {
        emergency: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
    };
    const colors = {
        emergency: "red",
        error: "red",
        warn: "yellow",
        info: "green",
        debug: "gray",
    };
    winston_1.default.addColors(colors);
    const transports = [
        new winston_1.default.transports.Console({
            level: logLevel,
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple(), winston_1.default.format.json()),
        }),
    ];
    const logger = winston_1.default.createLogger({
        levels,
        silent: false,
        transports,
    });
    return {
        error(message, error) {
            logger.error(format(mod, feature, message), {
                error,
            });
        },
        warn(message, data) {
            logger.warn(format(mod, feature, message), {
                data,
            });
        },
        info(message, data) {
            logger.info(format(mod, feature, message), {
                data,
            });
        },
        debug(message, data) {
            logger.debug(format(mod, feature, message)),
                {
                    data,
                };
        },
    };
};
// Reference Usage:
// const logger = createLogger( ModuleType.Controller, "AUTH" );
// logger.info("User created", { userId: 123 });
exports.default = createLogger;
//# sourceMappingURL=logger.js.map