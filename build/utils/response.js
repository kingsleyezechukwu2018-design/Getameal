"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = void 0;
const handleResponse = ({ res, data, status = 200, }) => {
    return res.status(status).json(data);
};
exports.handleResponse = handleResponse;
//# sourceMappingURL=response.js.map