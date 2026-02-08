"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthSchema = exports.emailLoginSchema = exports.emailSignUpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.emailSignUpSchema = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
exports.emailLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
exports.googleAuthSchema = joi_1.default.object({
    googleToken: joi_1.default.string().required()
});
//# sourceMappingURL=validation.auth.js.map