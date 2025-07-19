import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { usersService } from "../../users/application/users.service";

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const isDeleted = await usersService.delete(id);
    console.log(isDeleted);
    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound);
    }
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
