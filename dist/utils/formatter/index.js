"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeWords = void 0;
const capitalizeWords = (text) => {
    return text
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() +
        word.slice(1))
        .join(" ");
};
exports.capitalizeWords = capitalizeWords;
