import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { createErrorMessages } from "../../../core/error.utils";
import { usersService } from "../../application/users.service";

export async function deleteUserHandler(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const result = await usersService.delete(id);
    console.log(result);
    if (result === undefined) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "User not found" }]),
        );
      return;
    } else {
      res.status(HttpStatus.NoContent).send();
    }
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
