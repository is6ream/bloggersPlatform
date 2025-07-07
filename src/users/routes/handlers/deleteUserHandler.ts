import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { createErrorMessages } from "../../../core/error.utils";
import { usersService } from "../../application/users.service";

export async function deleteUserHandler(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const result = await usersService.delete(id);
    if (result === null) {
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
    res.sendStatus(HttpStatus.NoContent);
    return;
  }
}
