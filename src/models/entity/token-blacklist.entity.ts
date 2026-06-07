import { Document } from "mongoose";

export default interface TokenBlacklist extends Document {
  token: string;
  username: string;
  logoutAt: Date;
  expiresAt: Date;
}
