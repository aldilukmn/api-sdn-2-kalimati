"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        app_1.default.listen(process.env.PORT ?? 8086, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT ?? 8086}/api`);
        });
    }
    catch (error) {
        console.error('Failed to start server: ', error);
        throw error;
    }
};
startServer();
