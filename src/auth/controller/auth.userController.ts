import { Request, Response } from "express";
import { authService } from "../application/auth.service";
import { HttpStatus } from "../../core/http-statuses";

export async function loginUserController(req: Request, res: Response) {
  const { loginOrEmail, password } = req.body;
  try {
    const result = await authService.create(loginOrEmail, password);
    res.status(204).send(result);
  } catch (err: unknown) {
    console.log(err);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
