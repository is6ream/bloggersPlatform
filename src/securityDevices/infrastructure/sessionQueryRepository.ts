import { sessionCollection } from "../../db/mongo.db";
import { SessionDB } from "../../auth/sessions/types/sessionDataTypes";

export type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

export const sessionQueryRepository = {
  async getAllSessions(): Promise<DeviceViewModel[]> {
    const sessions: SessionDB[] = await sessionCollection.find({}).toArray();
    return sessions.map((session) => {
      return {
        ip: session.ip,
        title: session.deviceName,
        lastActiveDate: session.iat,
        deviceId: session.deviceId,
      };
    });
  },
};
