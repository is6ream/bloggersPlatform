import { SessionDataType } from "../../auth/types/input/login-input.models";
import { sessionCollection } from "../../db/mongo.db";

export const sessionsRepository = {
  async createSession(sessionData: SessionDataType): Promise<string> {
    const session = await sessionCollection.insertOne(sessionData);
    return session.insertedId.toString();
  },
  async updateSessions(iat: string, deviceId: string): Promise<void> {
    await sessionCollection.updateOne({ iat: iat }, { $set: { deviceId } });
    return;
  },
};
