"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Routes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const otp_1 = __importDefault(require("./otp"));
const location_1 = __importDefault(require("./location"));
const deviceToken_1 = __importDefault(require("./deviceToken"));
const router = (0, express_1.Router)();
exports.v1Routes = router;
router.use("/auth", auth_1.default);
router.use("/otp", otp_1.default);
router.use("/locations", location_1.default);
router.use("/device-token", deviceToken_1.default);
//# sourceMappingURL=index.js.map