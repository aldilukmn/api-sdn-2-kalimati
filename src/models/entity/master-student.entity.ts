import { Document } from "mongoose";

export default interface MasterStudent extends Document {
  studentId: string;
  name: string;
  gender: "L" | "P";
  grade: string;
  createdAt?: Date;
  updatedAt?: Date;
}
