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
exports.emailSignUp = emailSignUp;
exports.emailLogin = emailLogin;
exports.googleAuth = googleAuth;
const errors_1 = require("../../configs/errors");
const logger_1 = __importStar(require("../../utils/logger"));
const users_entity_1 = require("../../models/users/users.entity");
const otp_1 = require("../../controllers/otp");
const types_otp_1 = require("../../controllers/otp/types_otp");
const googleAuthLibrary_1 = require("../../configs/googleAuthLibrary");
const util_auth_1 = require("./util_auth");
const logger = (0, logger_1.default)(logger_1.ModuleType.Controller, "AUTH");
async function emailSignUp(email) {
    logger.info("email signup request", { email });
    const user = await users_entity_1.UserEntity.findByParams({ email });
    if (!user) {
        logger.info("creating new user...", { email });
        await users_entity_1.UserEntity.createUser({ email });
    }
    const otp = await (0, otp_1.createOtp)(email, types_otp_1.OtpType.AUTH);
    //TODO: send email with otp code
    logger.info("otp sent to email", { email, otp });
    return { message: "OTP code has been sent to your email" };
}
async function emailLogin(email) {
    logger.info("email login request", { email });
    const user = await users_entity_1.UserEntity.findByParams({ email });
    if (!user) {
        const error = new errors_1.RouteError("Account does not exist");
        logger.info("email login failed", { email, error });
        throw error;
    }
    const otp = await (0, otp_1.createOtp)(email, types_otp_1.OtpType.AUTH);
    //TODO: send email with otp code
    logger.info("otp sent to email", { email, otp });
    return { message: "OTP code has been sent to your email" };
}
async function googleAuth({ googleToken }) {
    logger.info("google auth request", { googleToken });
    const { email } = await (0, googleAuthLibrary_1.verifyGoogleToken)(googleToken);
    logger.info("email signup request", { email });
    const user = await users_entity_1.UserEntity.findByParams({ email });
    if (!user) {
        logger.info("creating new user...", { email });
        await users_entity_1.UserEntity.createUser({ email });
    }
    let response;
    response.user = user;
    if (user.isComplete) {
        const accessToken = (0, util_auth_1.generateAccessToken)({
            data: { userId: user.id, role: user.role },
        });
        response = { accessToken, ...response };
    }
    return response;
}
// export async function appleAuth({
//   appleIdToken,
//   code,
// }: {
//   appleIdToken: string;
//   code: string;
// }) {
//   const clientSecret = generateAppleClientSecret();
//   const tokenResponse = await axiosApi(
//     "https://appleid.apple.com/auth/token",
//     "post",
//     { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
//     {
//       grant_type: "authorization_code",
//       code,
//       redirect_uri: REDIRECT_URI, //route after successful sign-in
//       client_id: CLIENT_ID,
//       client_secret: clientSecret,
//     },
//   );
//   const { access_token, id_token, refresh_token } = tokenResponse.data;
//   // id_token is a JWT containing user's Apple ID info
//   // You can verify it using jsonwebtoken library
//   // Example:
//   const decoded = jwt.decode(id_token);
//   console.log(decoded); // contains sub (user id), email, etc.
// }
//# sourceMappingURL=index.js.map