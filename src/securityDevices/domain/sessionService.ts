import { SessionsRepository } from "../infrastructure/sessionsRepository";
import {
  handleForbiddenResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { Result } from "../../core/result/result.type";
//остановился на том, что начал внедрять зависимость BLL от DAL
export class SessionService {
  constructor(private sessionsRepository: SessionsRepository) {}
  async deleteAllDeviceSessions(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await this.sessionsRepository.deleteAllSessions(userId, deviceId);
    return;
  }
  async deleteByDeviceId(
    deviceIdFromParams: string,
    sessionDeviceId: string, //для чего?
    userId: string | undefined,
  ): Promise<Result<null>> {
    //ищем сессию по deviceId из payload
    const session =
      await this.sessionsRepository.isSessionExistByDeviceId(
        deviceIdFromParams,
      );
    if (!session) {
      return handleNotFoundResult("session not found", "deviceId from params");
    }
    //если id пользователя делающего запрос на удаление сессии !== id пользователя, сессии которой user пытается удалить - 403
    if (session.userId !== userId) {
      return handleForbiddenResult("access denied", "userId not found");
    }
    const result =
      await this.sessionsRepository.deleteSessionByDeviceId(deviceIdFromParams);
    if (!result) {
      //на случай race condtion
      return handleNotFoundResult("session not found", "deviceId");
    }
    return handleSuccessResult();
  }
}
