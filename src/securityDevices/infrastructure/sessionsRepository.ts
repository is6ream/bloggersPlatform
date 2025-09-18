import { SessionDataType } from "../../auth/types/input/login-input.models";
import { sessionCollection } from "../../db/mongo.db";

export const sessionsRepository = {
  async createSession(sessionData: SessionDataType): Promise<void> {
    await sessionCollection.insertOne(sessionData);
    return;
  },
  async updateSessions(iat: string, deviceId: string): Promise<void> {
    await sessionCollection.updateOne({ iat: iat }, { $set: { deviceId } });
    return;
  },
};
