import { sessionsRepository } from "../infrastructure/sessionsRepository";

export const sessionService = {
  async deleteAllDeviceSessions(): Promise<void> {
    await sessionsRepository.deleteAllSessions();
    return;
  },
};
