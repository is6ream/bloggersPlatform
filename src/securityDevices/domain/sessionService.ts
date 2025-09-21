import { sessionsRepository } from "../infrastructure/sessionsRepository";
import {
  handleForbiddenResult,
  handleNotFoundResult,
  handleSuccessResult,
  handleUnauthorizedFResult,
} from "../../core/result/handleResult";
import { Result } from "../../core/result/result.type";

export const sessionService = {
  async deleteAllDeviceSessions(): Promise<void> {
    await sessionsRepository.deleteAllSessions();
    return;
  },
  async deleteByDeviceId(
    deviceId: string,
    sessionDeviceId: string,
  ): Promise<Result<null>> {
      console.log("deviceId BLL", deviceId);
      console.log("sessionDeviceId BLL", sessionDeviceId);
    if (deviceId !== sessionDeviceId) {
      return handleForbiddenResult("forbidden", "deviceId");
    }
    const result = await sessionsRepository.deleteSessionByDeviceId(deviceId);
    if (!result) {
      return handleNotFoundResult("session not found", "deviceId");
    }
    return handleSuccessResult();
  },
};
