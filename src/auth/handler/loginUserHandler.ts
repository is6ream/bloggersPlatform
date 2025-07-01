import { Request, Response } from "express";
import { authService } from "../application/auth.service";

export type createAuthDto = {
  loginOrEmail: string;
  passwordHash: string;
};
export async function loginUserHandler(req: Request, res: Response) {
  const { loginOrEmail, password } = req.body;
  const passwordHash = await bcryptService.generateHash(password);
  const dto: createAuthDto = {
    loginOrEmail,
    passwordHash,
  };
  const dataForResponse = await authService.create(dto);
  res.status(204).send(dataForResponse);
}
