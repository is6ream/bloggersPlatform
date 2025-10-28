import { SessionDB } from "../types/sessionDataTypes";
import { DeviceViewModel } from "../types/securityDevicesTypes";
import { injectable } from "inversify";
import { SessionModel } from "../types/securityDevicesMongoose";

@injectable()
export class SessionQueryRepository {
  async getAllSessions(userId: string): Promise<DeviceViewModel[]> {
    const sessions: SessionDB[] = await SessionModel.find({
      userId: userId,
    }).lean();
    return sessions.map((session) => {
      return {
        ip: session.ip,
        title: session.deviceName,
        lastActiveDate: session.iat,
        deviceId: session.deviceId,
      };
    });
  }
}
