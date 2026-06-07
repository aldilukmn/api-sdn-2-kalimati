import TokenBlacklistModel from "../models/schema/token-blacklist.schema";
import TokenBlacklist from "../models/entity/token-blacklist.entity";

export default class TokenBlacklistRepository {
  static addToBlacklist = async (
    token: string,
    username: string,
    expiresAt: Date
  ): Promise<TokenBlacklist> => {
    try {
      const blacklistedToken = await TokenBlacklistModel.create({
        token,
        username,
        expiresAt,
      });
      return blacklistedToken;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new Error("Failed to add token to blacklist");
    }
  };

  static isTokenBlacklisted = async (token: string): Promise<boolean> => {
    try {
      const result = await TokenBlacklistModel.findOne({ token });
      return !!result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new Error("Failed to check token blacklist");
    }
  };
}
