"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultResponse = (code, response, message, result) => {
    return {
        status: {
            code,
            response,
            message,
        },
        result
    };
};
exports.default = defaultResponse;
