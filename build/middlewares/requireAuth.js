"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const errors_1 = require("../configs/errors");
const users_entity_1 = require("../models/users/users.entity");
const requireAuth = async (req, _res, next) => {
    try {
        if (!req.userId) {
            throw new errors_1.RouteError("authorization failed");
        }
        const user = await users_entity_1.UserEntity.findByParams({ id: req.userId });
        if (!user || !user.isComplete) {
            throw new errors_1.RouteError("authorization failed");
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=requireAuth.js.map