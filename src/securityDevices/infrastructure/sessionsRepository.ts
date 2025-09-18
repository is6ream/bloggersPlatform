import { SessionDataType } from "../../auth/types/input/login-input.models";
import { sessionCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";
import { SessionDB } from "../types/sessionDataTypes";

export const sessionsRepository = {
  async createSession(sessionData: SessionDataType): Promise<void> {
    await sessionCollection.insertOne(sessionData);
    return;
  },
  async updateSessions(newIat: number, deviceId: string): Promise<void> {
    await sessionCollection.findOneAndUpdate(
      { deviceId: deviceId },
      { $set: { iat: newIat } },
      { returnDocument: "after" },
    );
    return;
  },
  async isSessionExistByIat(iat: number): Promise<boolean> {
    console.log(typeof iat);
    const session: WithId<SessionDB> | null = await sessionCollection.findOne({
      iat: iat,
    });
    console.log(session);
    return !!session;
  },
};
