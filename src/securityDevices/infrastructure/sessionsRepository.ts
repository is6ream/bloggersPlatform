import { SessionDataType } from "../../auth/types/input/login-input.models";
import { sessionCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";
import { SessionDB } from "../types/sessionDataTypes";

export const sessionsRepository = {
  async createSession(sessionData: SessionDataType): Promise<void> {
    await sessionCollection.insertOne(sessionData);
    return;
  },
  async updateSessions(newIat: string, deviceId: string): Promise<boolean> {
    const updateResult = await sessionCollection.updateOne(
      { deviceId: deviceId },
      { $set: { iat: newIat } },
    );
    return updateResult.modifiedCount === 1; //нужно всегда проверять количество изменных документов
  },
  async isSessionExistByIat(iat: string): Promise<boolean> {
    const session: WithId<SessionDB> | null = await sessionCollection.findOne({
      iat: iat,
    });
    return !!session;
  },
  async deleteAllSessions(): Promise<void> {
    await sessionCollection.deleteMany();
    return;
  },
};
