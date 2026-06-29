"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const master_student_schema_1 = __importDefault(require("./models/schema/master-student.schema"));
const student_attendance_schema_1 = __importDefault(require("./models/schema/student-attendance.schema"));
dotenv_1.default.config();
const STATUSES = [
    "hadir", "hadir", "hadir", "hadir", "hadir",
    "hadir", "hadir", "hadir", "hadir", "hadir",
    "hadir", "hadir", "hadir", "hadir", "hadir",
    "hadir", "hadir", "hadir", "hadir", "hadir",
    "hadir", "hadir", "hadir", "hadir", "hadir",
    "hadir", "hadir", "hadir", "hadir", "hadir",
    "hadir", "hadir", "hadir", "hadir", "hadir",
    "sakit", "sakit",
    "izin", "izin",
    "alpha", "alpha",
];
function randomStatus() {
    return STATUSES[Math.floor(Math.random() * STATUSES.length)];
}
function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
function getWeekdays(daysBack) {
    const dates = [];
    const now = new Date();
    for (let i = daysBack; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const day = d.getDay();
        if (day !== 0 && day !== 6) {
            dates.push(formatDate(d));
        }
    }
    return dates;
}
async function seedAttendance() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI not set in .env");
        process.exit(1);
    }
    await mongoose_1.default.connect(mongoUri);
    console.log("Connected to MongoDB");
    const students = await master_student_schema_1.default.find({}).lean();
    console.log(`Found ${students.length} students`);
    if (students.length === 0) {
        console.log("No students found. Seed master_students first.");
        await mongoose_1.default.disconnect();
        return;
    }
    const daysBack = 30;
    const dates = getWeekdays(daysBack);
    console.log(`Generating attendance for ${dates.length} weekdays (past ${daysBack} days)`);
    const docs = [];
    for (const student of students) {
        for (const date of dates) {
            docs.push({
                studentId: student.studentId,
                name: student.name,
                grade: student.grade,
                date,
                status: randomStatus(),
            });
        }
    }
    console.log(`Prepared ${docs.length} attendance records`);
    for (const date of dates) {
        await student_attendance_schema_1.default.deleteMany({ date });
    }
    console.log("Cleared existing data for date range");
    await student_attendance_schema_1.default.insertMany(docs);
    console.log(`Seeded ${docs.length} attendance records`);
    const byStatus = await student_attendance_schema_1.default.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    byStatus.forEach((s) => {
        console.log(`  ${s._id}: ${s.count}`);
    });
    await mongoose_1.default.disconnect();
    console.log("Done");
}
seedAttendance();
