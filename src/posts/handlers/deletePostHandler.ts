import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { usersService } from "../../users/application/users.service";

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const deleteResult = await usersService.delete(id);
    console.log(deleteResult);
    if (!deleteResult) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }
    res.sendStatus(HttpStatus.NoContent);
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
