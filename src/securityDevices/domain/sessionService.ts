import { sessionsRepository } from "../infrastructure/sessionsRepository";
import {
  handleForbiddenResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { Result } from "../../core/result/result.type";

export const sessionService = {
  async deleteAllDeviceSessions(): Promise<void> {
    await sessionsRepository.deleteAllSessions();
    return;
  },
  async deleteByDeviceId(
    deviceIdFromParams: string,
    sessionDeviceId: string,
  ): Promise<Result<null>> {
    //для начала мы должны проверить, есть ли deviceId из параметров в бд
    const sessionExist =
      await sessionsRepository.isSessionExistByDeviceId(deviceIdFromParams);
    if (!sessionExist) {
      return handleNotFoundResult("session not found", "deviceId from params");
    }
    if (deviceIdFromParams !== sessionDeviceId) {
      return handleForbiddenResult("forbidden", "deviceId");
    }
    const result =
      await sessionsRepository.deleteSessionByDeviceId(deviceIdFromParams);
    if (!result) {
      //на случай race condtion
      return handleNotFoundResult("session not found", "deviceId");
    }
    return handleSuccessResult();
  },
};
