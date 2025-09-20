import { sessionsRepository } from "../infrastructure/sessionsRepository";
import {
  handleNotFoundResult,
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
  ): Promise<Result<string | null>> {
    if (deviceId !== sessionDeviceId) {
      return handleUnauthorizedFResult("unauthorized", "deviceId");
    }
    const deleteResult = await sessionsRepository.deleteById(deviceId);
    if (!deleteResult) {
      return handleNotFoundResult("session not found", "device id");
    }
  },
};
