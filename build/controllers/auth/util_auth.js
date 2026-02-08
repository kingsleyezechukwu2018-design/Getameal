"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateAppleClientSecret = generateAppleClientSecret;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../../configs"));
const fs_1 = __importDefault(require("fs"));
const { jwtExpiresIn, jwtSecret } = configs_1.default;
function generateAccessToken({ data, expiresIn = jwtExpiresIn, audience = "app", }) {
    return jsonwebtoken_1.default.sign(data, jwtSecret, {
        expiresIn: expiresIn,
        issuer: `getameal`,
        audience: `${audience}-user`,
    });
}
//TODO
function generateAppleClientSecret() {
    const privateKey = fs_1.default.readFileSync("./AuthKey_XXXXXXXXXX.p8"); // your .p8 file
    const teamId = "YOUR_TEAM_ID";
    const clientId = "YOUR_SERVICE_ID"; // your Service ID
    const keyId = "YOUR_KEY_ID"; // Key ID from Apple
    const token = jsonwebtoken_1.default.sign({}, privateKey, {
        algorithm: "ES256",
        expiresIn: "24h",
        issuer: teamId,
        audience: "https://appleid.apple.com",
        subject: clientId,
        keyid: keyId,
    });
    return token;
}
//# sourceMappingURL=util_auth.js.map