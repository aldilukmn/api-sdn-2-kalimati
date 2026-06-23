import { Document } from "mongoose";

export default interface MasterStudent extends Document {
  studentId: string;
  name: string;
  grade: string;
  createdAt?: Date;
  updatedAt?: Date;
}
