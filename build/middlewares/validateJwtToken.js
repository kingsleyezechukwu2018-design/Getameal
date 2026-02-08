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
exports.validateJwtToken = void 0;
const configs_1 = __importDefault(require("../configs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importStar(require("../utils/logger"));
const { jwtSecret } = configs_1.default;
const logger = (0, logger_1.default)(logger_1.ModuleType.Middleware, "AUTH");
const validateJwtToken = async (req, res, next) => {
    let token = req.headers["authorization"];
    token = token?.replace("Bearer ", "");
    if (!token)
        return next();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.userId = decoded.userId;
        logger.info("decoded token", { decoded });
        return next();
    }
    catch (err) {
        logger.error("error validating jwt token", { err });
        if (err.name) {
            if (err.name === "JsonWebTokenError") {
                res.status(401).json({ message: "invalid" });
                return next({ message: "invalid token" });
            }
            else if (err.name === "TokenExpiredError") {
                res
                    .status(401)
                    .json({ message: "You have been logged out. Please login again" });
                return next({ message: "authentication expired. Please login again" });
            }
        }
        next({ message: err.message || "Authentication error" });
    }
};
exports.validateJwtToken = validateJwtToken;
//# sourceMappingURL=validateJwtToken.js.map