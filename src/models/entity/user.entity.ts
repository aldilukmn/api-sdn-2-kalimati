import { Document } from "mongoose";

export default interface User extends Document {
  username: string;
  password: string;
  role: string;
  // image_url: string;
  // image_id: string;
};