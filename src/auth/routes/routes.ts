import { Router } from "express";
import { authValidators } from "../middlewares/auth.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { loginUserHandler } from "../handler/auth.userHandler";
export const authRouter = Router();

authRouter.post(
  "/auth/login",
  authValidators,
  inputValidationResultMiddleware,
  loginUserHandler,
);
