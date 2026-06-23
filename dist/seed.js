"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const master_student_schema_1 = __importDefault(require("./models/schema/master-student.schema"));
dotenv_1.default.config();
const seed = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI not set in .env");
        process.exit(1);
    }
    await mongoose_1.default.connect(mongoUri);
    console.log("Connected to MongoDB");
    const filePath = path_1.default.join(__dirname, "data/data_murid.json");
    const raw = fs_1.default.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    await master_student_schema_1.default.deleteMany({});
    const result = await master_student_schema_1.default.insertMany(data);
    console.log(`Seeded ${result.length} students`);
    await mongoose_1.default.disconnect();
    console.log("Done");
};
seed();
