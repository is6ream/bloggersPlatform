import { HttpStatus } from "../../../core/http-statuses";
import { usersQueryRepository } from "../../../users/repositories/user.query.repository";
import { Request, Response } from "express";
import { CurrentUser } from "../../../users/types/user-types";

export async function getInfoAboutUserController(req: Request, res: Response) {
  if (!req.userId) res.sendStatus(HttpStatus.Unauthorized);
  const userId = req.userId;

  const me: CurrentUser | null = await usersQueryRepository.findById(userId!);

  res.status(HttpStatus.Ok).send(me);
}
