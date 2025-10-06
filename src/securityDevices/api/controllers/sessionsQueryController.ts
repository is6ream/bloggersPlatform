import { SessionQueryRepository } from "../../infrastructure/sessionQueryRepository";
import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";

class SessionsQueryController {
  private sessionsQueryRepository: SessionQueryRepository;
  constructor() {
    this.sessionsQueryRepository = new SessionQueryRepository();
  }
  async getAllDevices(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }
    const sessions = await this.sessionsQueryRepository.getAllSessions(userId); //неправильная логика
    res.status(HttpStatus.Ok).send(sessions);
  }
}

export const sessionsQueryController = new SessionsQueryController();
