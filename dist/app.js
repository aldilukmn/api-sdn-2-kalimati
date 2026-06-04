"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); //For Login body json, POST METHOD
app.use(express_1.default.urlencoded({ extended: true })); //For Login body json, POST METHOD
app.use((0, cors_1.default)({
    origin: ['https://sdn2kalimati.vercel.app', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Sesuaikan dengan method yang kamu perlukan
    credentials: true
}));
app.use('/', router_1.default);
exports.default = app;
