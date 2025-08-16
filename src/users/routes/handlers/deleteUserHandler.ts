import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { usersService } from "../../application/users.service";
import { ResultStatus } from "../../../core/result/resultCode";

export async function deleteUserHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const result = await usersService.delete(id);
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatus.NotFound);
    }
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
