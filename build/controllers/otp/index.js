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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOtp = createOtp;
exports.verifyOtp = verifyOtp;
exports.resendOtp = resendOtp;
const errors_1 = require("../../configs/errors");
const otp_entity_1 = require("../../models/otp/otp.entity");
const util_otp_1 = require("./util_otp");
const logger_1 = __importStar(require("../../utils/logger"));
const types_otp_1 = require("./types_otp");
const users_entity_1 = require("../../models/users/users.entity");
const util_auth_1 = require("../../controllers/auth/util_auth");
const logger = (0, logger_1.default)(logger_1.ModuleType.Controller, "OTP");
/**
 * Create or update an OTP
 * @param email - The email address to associate with the OTP
 */
async function createOtp(email, type) {
    logger.info("otp creation request", { email });
    try {
        let otp = await otp_entity_1.OtpEntity.findByParams({ email, type });
        if (otp && !otp.isUsed) {
            const code = (0, util_otp_1.generateOtp)();
            const expireAt = (0, util_otp_1.getOtpExpireAt)();
            otp = await otp_entity_1.OtpEntity.updateOtp({ id: otp.id }, { code, expireAt });
            logger.info("otp updated", { email, code, expireAt, otp });
            return otp;
        }
        const code = (0, util_otp_1.generateOtp)();
        const expireAt = (0, util_otp_1.getOtpExpireAt)();
        otp = await otp_entity_1.OtpEntity.createOtp({ email, code, expireAt, type });
        logger.info("otp created", { email, code, expireAt, otp });
        return otp;
    }
    catch (error) {
        throw error;
    }
}
async function verifyOtp(email, code, type) {
    try {
        logger.info("otp verification request", { email, code, type });
        let otp = await otp_entity_1.OtpEntity.findByParams({ email, type, code });
        if (!otp || otp.isUsed || otp.expireAt < new Date()) {
            const error = new errors_1.RouteError("Invalid OTP");
            logger.info("otp verification failed", { email, otp, error });
            throw error;
        }
        otp = await otp_entity_1.OtpEntity.updateOtp({ id: otp.id }, { isUsed: true });
        logger.info("otp verification successful", { email, code, otp, type });
        let user, response = { isOtpVerified: true };
        if (types_otp_1.AllowedLoginOtpTypes.includes(otp.type)) {
            logger.info("attempting authentication", { email });
            user = await users_entity_1.UserEntity.findByParams({ email });
            response.user = user;
            if (user && user.isComplete) {
                logger.info("generating access token for user", { user });
                const accessToken = (0, util_auth_1.generateAccessToken)({
                    data: { userId: user.id, role: user.role },
                });
                response = { accessToken, ...response };
            }
            return response;
        }
        return response;
    }
    catch (error) {
        throw error;
    }
}
async function resendOtp(email, type) {
    try {
        logger.info("otp resend request", { email, type });
        const otp = await createOtp(email, type);
        //TODO: send otp via email service (TODO)
        logger.info("otp sent to email", { email, otp });
        return { message: "OTP code has been sent to your email" };
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=index.js.map