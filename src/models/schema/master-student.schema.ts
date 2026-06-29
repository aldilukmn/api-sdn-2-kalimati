import mongoose, { Schema } from "mongoose";
import MasterStudent from "../entity/master-student.entity";

const MasterStudentSchema: Schema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["L", "P"],
    },
  },
  {
    collection: "master_students",
    timestamps: true,
  }
);

const MasterStudentModel = mongoose.model<MasterStudent>(
  "master_students",
  MasterStudentSchema
);

export default MasterStudentModel;
