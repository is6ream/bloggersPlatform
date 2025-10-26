import { SessionDataType } from "../../auth/types/input/login-input.models";
import { WithId } from "mongodb";
import { SessionDB } from "../types/sessionDataTypes";
import { injectable } from "inversify";
import { SessionModel } from "../types/securityDevicesMongoose";

@injectable()
export class SessionsRepository {
  async createSession(sessionData: SessionDataType): Promise<void> {
    const session = new SessionModel();
    session.userId = sessionData.userId;
    session.deviceId = sessionData.deviceId;
    session.iat = sessionData.iat;
    session.deviceName = sessionData.deviceName;
    session.ip = sessionData.ip;

    await session.save();
  }

  async updateSessions(newIat: string, deviceId: string): Promise<boolean> {
    const updateResult = await SessionModel.updateOne(
      { deviceId: deviceId },
      { $set: { iat: newIat } },
    );
    return updateResult.modifiedCount === 1; //нужно всегда проверять количество изменных документов
  }

  async isSessionExistByIat(iat: string): Promise<boolean> {
    const session: WithId<SessionDB> | null = await SessionModel.findOne({
      iat: iat,
    });
    return !!session;
  }

  async isSessionExistByDeviceId(
    deviceId: string,
  ): Promise<WithId<SessionDB> | null> {
    return SessionModel.findOne({
      deviceId: deviceId,
    });
  }

  async deleteAllSessions(userId: string, deviceId: string): Promise<void> {
    await SessionModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return;
  }

  async deleteSessionByDeviceId(
    deviceId: string | undefined,
  ): Promise<boolean> {
    const session = await SessionModel.findOne({ deviceId: deviceId });
    console.log("is session exist in DAL?", !!session);
    const deleteResult = await SessionModel.deleteOne({
      deviceId,
    });
    return !!deleteResult.deletedCount;
  }
}
