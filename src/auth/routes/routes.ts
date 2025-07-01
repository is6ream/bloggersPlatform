import { Router } from "express";
import { authValidators } from "../middlewares/auth.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { loginUserHandler } from "../handler/auth.userHandler";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";
export const authRouter = Router();

authRouter.post(
  "/auth/login",
  superAdminGuardMiddleware,
  authValidators,
  inputValidationResultMiddleware,
  loginUserHandler,
);
