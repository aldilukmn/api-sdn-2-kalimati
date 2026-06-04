"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateToken = (token) => {
    if (!token) {
        throw new Error('please login first!');
    }
    ;
    if (!token.startsWith('Bearer')) {
        throw new Error('wrong format token!');
    }
    ;
    const getToken = token.split(' ')[1];
    return getToken;
};
exports.default = validateToken;
