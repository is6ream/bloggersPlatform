import { Request, Response } from "express";
import { authService } from "../application/auth.service";

export type CreateAuthDto = {
  loginOrEmail: string;
  passwordHash: string;
};
export async function loginUserHandler(req: Request, res: Response) {
  const { loginOrEmail, password } = req.body;

  const dataForResponse = await authService.create(loginOrEmail, password);
  res.status(204).send(dataForResponse);
}
