import { SessionDataType } from "../../auth/types/input/login-input.models";
import { sessionCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";
import { SessionDB } from "../types/sessionDataTypes";
//нужно внедрить зависимость сервиса от репозитория
export class SessionsRepository {
  async createSession(sessionData: SessionDataType): Promise<void> {
    await sessionCollection.insertOne(sessionData);
    return;
  }
  async updateSessions(newIat: string, deviceId: string): Promise<boolean> {
    const updateResult = await sessionCollection.updateOne(
      { deviceId: deviceId },
      { $set: { iat: newIat } },
    );
    return updateResult.modifiedCount === 1; //нужно всегда проверять количество изменных документов
  }
  async isSessionExistByIat(iat: string): Promise<boolean> {
    const session: WithId<SessionDB> | null = await sessionCollection.findOne({
      iat: iat,
    });
    return !!session;
  }
  async isSessionExistByDeviceId(
    deviceId: string,
  ): Promise<WithId<SessionDB> | null> {
    return await sessionCollection.findOne({
      deviceId: deviceId,
    });
  }
  async deleteAllSessions(userId: string, deviceId: string): Promise<void> {
    await sessionCollection.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return;
  }
  async deleteSessionByDeviceId(
    deviceId: string | undefined,
  ): Promise<boolean> {
    const session = await sessionCollection.findOne({ deviceId: deviceId });
    console.log("is session exist in DAL?", !!session);
    const deleteResult = await sessionCollection.deleteOne({
      deviceId,
    });
    return !!deleteResult.deletedCount;
  }
}
