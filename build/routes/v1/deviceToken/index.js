"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateInput_1 = require("../../../middlewares/validateInput");
const helpers_1 = require("../../../utils/helpers");
const validation_deviceToken_1 = require("./validation.deviceToken");
const deviceToken_1 = require("../../../controllers/deviceToken");
const middlewares_1 = require("../../../middlewares");
const router = (0, express_1.Router)();
router.use(middlewares_1.validateJwtToken, middlewares_1.requireAuth);
router.post("/", (0, validateInput_1.validateInput)(validation_deviceToken_1.addDeviceTokenSchema), (0, helpers_1.asyncWrapper)(async (req, res, _next) => {
    const userId = req.userId;
    const { token, platform } = req.body;
    const result = await (0, deviceToken_1.createDeviceToken)({
        userId,
        token,
        platform,
    });
    res.json(result);
}));
exports.default = router;
//# sourceMappingURL=index.js.map