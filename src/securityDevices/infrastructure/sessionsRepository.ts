import { SessionDataType } from "../../auth/types/input/login-input.models";
import { sessionCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";
import { SessionDB } from "../types/sessionDataTypes";

export const sessionsRepository = {
  async createSession(sessionData: SessionDataType): Promise<void> {
    await sessionCollection.insertOne(sessionData);
    return;
  },
  async updateSessions(newIat: number, deviceId: string): Promise<boolean> {
    console.log("Input:", { deviceId, newIat, newIatType: typeof newIat });

    const currentSession = await sessionCollection.findOne({
      deviceId: deviceId,
    });
    console.log("curentSession", currentSession);
    const updateResult = await sessionCollection.updateOne(
      { deviceId: deviceId },
      { $set: { iat: newIat } },
    );

    console.log("Update result:", {
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
      acknowledged: updateResult.acknowledged,
    });
    return updateResult.modifiedCount === 1; //нужно всегда проверять количество изменных документов
  },
  async isSessionExistByIat(iat: number): Promise<boolean> {
    const session: WithId<SessionDB> | null = await sessionCollection.findOne({
      iat: iat,
    });
    console.log(session, "active session check");
    return !!session;
  },
};
