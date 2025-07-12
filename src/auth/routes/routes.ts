import { Router } from "express";
import { authValidators } from "../middlewares/auth.validation";
import { loginUserHandler } from "../handler/auth.userHandler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
export const authRouter = Router();

authRouter.post(
  "/auth/login",
  authValidators,
  inputValidationResultMiddleware,
  loginUserHandler,
);
