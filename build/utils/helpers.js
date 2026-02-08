"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrapper = exports.axiosApi = void 0;
const axios_1 = __importDefault(require("axios"));
const axiosApi = async (url, method, headers, payload) => {
    const { data } = await (0, axios_1.default)({
        method,
        url,
        ...headers,
        data: payload,
    });
    return data;
};
exports.axiosApi = axiosApi;
const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.asyncWrapper = asyncWrapper;
//# sourceMappingURL=helpers.js.map