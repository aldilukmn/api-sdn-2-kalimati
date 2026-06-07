import mongoose, { Schema } from "mongoose";
import TokenBlacklist from "../entity/token-blacklist.entity";

const TokenBlacklistSchema: Schema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    logoutAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "token_blacklist",
  }
);

// TTL index: auto delete documents 1 second after expiresAt
TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TokenBlacklistModel = mongoose.model<TokenBlacklist>(
  "token_blacklist",
  TokenBlacklistSchema
);

export default TokenBlacklistModel;
