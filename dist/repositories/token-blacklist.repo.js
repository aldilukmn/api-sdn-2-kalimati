"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_blacklist_schema_1 = __importDefault(require("../models/schema/token-blacklist.schema"));
class TokenBlacklistRepository {
    static addToBlacklist = async (token, username, expiresAt) => {
        try {
            const blacklistedToken = await token_blacklist_schema_1.default.create({
                token,
                username,
                expiresAt,
            });
            return blacklistedToken;
        }
        catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            throw new Error("Failed to add token to blacklist");
        }
    };
    static isTokenBlacklisted = async (token) => {
        try {
            const result = await token_blacklist_schema_1.default.findOne({ token });
            return !!result;
        }
        catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            throw new Error("Failed to check token blacklist");
        }
    };
}
exports.default = TokenBlacklistRepository;
