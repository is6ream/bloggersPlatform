import { Router } from "express";
import { authValidators } from "../middlewares/auth.validation";

export const authRouter = Router();

authRouter.post("/auth/login", authValidators);
