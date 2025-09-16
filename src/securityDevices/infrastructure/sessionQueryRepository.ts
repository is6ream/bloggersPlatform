import { sessionCollection } from "../../db/mongo.db";
import { SessionDB } from "../../auth/sessions/types/sessionDataTypes";

export type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

export const sessionQueryRepository = {
  async getAllSessions(): Promise<DeviceViewModel> {
    const devices: SessionDB = await sessionCollection.find({});
    return devices.map(() => {
      ip: devices.ip;
      title: devices.title;
      lastActiveDate: devices.iat;
      deviceId: devices.deviceId;
    });
  },
};
