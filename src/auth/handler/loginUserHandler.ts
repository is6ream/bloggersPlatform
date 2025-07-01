import { Request, Response } from "express";
import { LoginInputModel } from "../input/login-input.model";

export async function loginUserHandler(req: Request, res: Response) {
  const { loginOrEmail, password } = req.body;
}
