import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { usersService } from "../../application/users.service";

export async function deleteUserHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const isDeleted = await usersService.delete(id);
    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound);
    }
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
