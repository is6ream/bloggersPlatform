import { sessionCollection } from "../../db/mongo.db";
import { SessionDB } from "../types/sessionDataTypes";
import { DeviceViewModel } from "../types/securityDevicesTypes";
import { injectable } from "inversify";

@injectable()
export class SessionQueryRepository {
  async getAllSessions(userId: string): Promise<DeviceViewModel[]> {
    const sessions: SessionDB[] = await sessionCollection
      .find({ userId: userId })
      .toArray();
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
