"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeParent = void 0;
const utils_1 = require("../utils");
const normalizeParent = (parent) => ({
    ...parent,
    name: (0, utils_1.capitalizeWords)(parent.name),
    occupation: parent.occupation === "IRT" ? parent.occupation : (0, utils_1.capitalizeWords)(parent.occupation),
});
exports.normalizeParent = normalizeParent;
