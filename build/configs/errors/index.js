"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteError = exports.InternalError = void 0;
class BaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "BaseError";
    }
    toString() {
        return JSON.stringify({
            name: this.name,
            message: this.message,
            stack: this.stack,
        });
    }
}
/**
 * Internal server error
 * is handled internally.
 * It should not be sent to the client
 */
class InternalError extends BaseError {
    constructor(message) {
        super(message);
        this.name = "InternalError";
        this.statusCode = 500;
    }
}
exports.InternalError = InternalError;
/**
 * Route error
 * is handled by the router and should be sent to the client for display to the user.
 * The error message can be shown to the user without formatting.
 */
class RouteError extends BaseError {
    constructor(message, httpCode) {
        super(message);
        this.name = "RouteError";
        this.statusCode = httpCode || 422;
    }
}
exports.RouteError = RouteError;
//# sourceMappingURL=index.js.map