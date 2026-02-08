"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.getOtpExpireAt = getOtpExpireAt;
const moment_1 = __importDefault(require("moment"));
/**
 * Generate a random 6-digit numeric code
 */
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
/**
 * Add seconds to the current date and return the result
 */
function getOtpExpireAt(seconds = 60) {
    return (0, moment_1.default)().add(seconds, "seconds").toDate();
}
//# sourceMappingURL=util_otp.js.map