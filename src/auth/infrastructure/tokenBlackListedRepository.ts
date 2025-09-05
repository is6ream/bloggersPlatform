import { blackListTokensCollection } from "../../db/mongo.db";

export const tokenBlackListedRepository = {
  async isBlackListed(refreshToken: string): Promise<boolean> {
    const result = await blackListTokensCollection.findOne({ refreshToken });
    await blackListTokensCollection.createIndex({ refreshToken: 1 });
    return !!result;
  },

  async addToBlackList(refreshToken: string, expiresAt: Date): Promise<void> {
    const result = await blackListTokensCollection.insertOne({
      refreshToken,
      expiresAt,
    });
  },
};
