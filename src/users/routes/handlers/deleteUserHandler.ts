import { Request, Response } from "express";
import { usersRepository } from "../../repositories/users.repository";
import { HttpStatus } from "../../../core/http-statuses";
import { createErrorMessages } from "../../../core/error.utils";

export async function deleteUserHandler(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const result = await usersRepository.delete(id);
    if (result === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "User not found" }]),
        );
      return;
    } else {
      res.status(HttpStatus.NoContent).send();
      return;
    }
  } catch (error: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
