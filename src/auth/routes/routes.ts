import { Router } from "express";
import { authValidators } from "../middlewares/auth.validation";
import { loginUserHandler } from "../handler/auth.userHandler";
export const authRouter = Router();

authRouter.post("/auth/login", authValidators, loginUserHandler);
