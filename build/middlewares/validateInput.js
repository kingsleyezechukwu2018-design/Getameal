"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = void 0;
const errors_1 = require("../configs/errors");
const validateInput = (schema, fieldType = "body") => (req, _res, next) => {
    let parsedData;
    if (fieldType === "body") {
        parsedData = schema.validate(req.body);
    }
    else if (fieldType === "params") {
        parsedData = schema.validate(req.params);
    }
    else if (fieldType === "query") {
        parsedData = schema.validate(req.query);
    }
    const { error, value } = parsedData;
    if (error) {
        const message = error.details
            .map((d) => d.message)
            .join(", ")
            .replace(/"/g, "");
        return next(new errors_1.RouteError(message, 400));
    }
    req[fieldType] = value;
    next();
};
exports.validateInput = validateInput;
//# sourceMappingURL=validateInput.js.map