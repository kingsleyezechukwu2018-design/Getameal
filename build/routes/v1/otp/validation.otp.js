"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.resendOtpSchema = void 0;
const types_otp_1 = require("../../../controllers/otp/types_otp");
const joi_1 = __importDefault(require("joi"));
exports.resendOtpSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    type: joi_1.default.string()
        .valid(...Object.values(types_otp_1.OtpType))
        .required(),
});
exports.verifyOtpSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    type: joi_1.default.string()
        .valid(...Object.values(types_otp_1.OtpType))
        .required(),
    code: joi_1.default.string().length(6).required(),
});
//# sourceMappingURL=validation.otp.js.map