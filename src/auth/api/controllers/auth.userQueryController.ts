import { UsersQueryRepository } from "../../../users/infrastructure/user.query.repository";
import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { CurrentUser } from "../../../users/types/user-types";

export class AuthUserQueryController {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async getInfoAboutUser(req: Request, res: Response) {
    if (!req.userId) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }
    const userId = req.userId;

    const me: CurrentUser | null =
      await this.usersQueryRepository.findById(userId);

    return res.status(HttpStatus.Ok).send(me);
  }
}
