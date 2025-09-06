import { blackListTokensCollection } from "../../db/mongo.db";
import { jwtService } from "../adapters/jwt.service";

export const tokenBlackListedRepository = {
  async isBlackListed(refreshToken: string): Promise<boolean> {
    const result = await blackListTokensCollection.findOne({ refreshToken });
    await blackListTokensCollection.createIndex({ refreshToken: 1 });
    return !!result;
  },

  async addToBlackList(refreshToken: string): Promise<void> {
    const dataForInsert = await jwtService.parseRefreshToken(refreshToken);
    await blackListTokensCollection.insertOne({
      refreshToken: refreshToken,
      expiresAt: dataForInsert!.expiresAt,
      userId: dataForInsert!.userId,
    });
    return;
  },
};
