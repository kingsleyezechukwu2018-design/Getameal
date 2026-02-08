"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateInput_1 = require("../../../middlewares/validateInput");
const validation_otp_1 = require("./validation.otp");
const controllers_1 = require("../../../controllers");
const helpers_1 = require("../../../utils/helpers");
const router = (0, express_1.Router)();
router.post("/resend", (0, validateInput_1.validateInput)(validation_otp_1.resendOtpSchema), async (req, res, next) => {
    try {
        const { email, type } = req.body;
        const result = await (0, controllers_1.resendOtp)(email, type);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.post("/verify", (0, validateInput_1.validateInput)(validation_otp_1.verifyOtpSchema), (0, helpers_1.asyncWrapper)(async (req, res, _next) => {
    const { email, code, type } = req.body;
    const result = await (0, controllers_1.verifyOtp)(email, code, type);
    res.json(result);
}));
exports.default = router;
//# sourceMappingURL=index.js.map