import { HttpStatus } from "../../core/http-statuses";
import { IdType } from "../../core/types/authorization/id";
import { RequestWithUserId } from "../../core/types/requests/requests";
import { usersQueryRepository } from "../../users/repositories/user.query.repository";
import { Response } from "express";

export async function getInfoAboutUserController(
  req: RequestWithUserId<IdType>,
  res: Response,
) {
  const userId = req.user?.id as string;

  if (!userId) res.sendStatus(HttpStatus.Unauthorized);
  const me = await usersQueryRepository.findById(userId);

  res.status(HttpStatus.Ok).send(me);
}
