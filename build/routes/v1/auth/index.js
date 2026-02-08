"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_auth_1 = require("./validation.auth");
const validateInput_1 = require("../../../middlewares/validateInput");
const controllers_1 = require("../../../controllers");
const helpers_1 = require("../../../utils/helpers");
const router = (0, express_1.Router)();
router.post("/email/signup", (0, validateInput_1.validateInput)(validation_auth_1.emailSignUpSchema), (0, helpers_1.asyncWrapper)(async (req, res, _next) => {
    const { email } = req.body;
    const result = await (0, controllers_1.emailSignUp)(email);
    res.json(result);
}));
router.post("/email/login", (0, validateInput_1.validateInput)(validation_auth_1.emailLoginSchema), (0, helpers_1.asyncWrapper)(async (req, res, _next) => {
    const { email } = req.body;
    const result = await (0, controllers_1.emailLogin)(email);
    res.json(result);
}));
router.post("/google/callback", (0, validateInput_1.validateInput)(validation_auth_1.googleAuthSchema), (0, helpers_1.asyncWrapper)(async (req, res, _next) => {
    const { googleToken } = req.body;
    const result = await (0, controllers_1.googleAuth)({ googleToken });
    res.json(result);
}));
exports.default = router;
//# sourceMappingURL=index.js.map