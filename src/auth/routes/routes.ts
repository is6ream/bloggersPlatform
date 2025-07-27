import { Router } from "express";
import { authValidators } from "../middlewares/auth.validation";
import { loginUserController } from "../controller/auth.userController";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
export const authRouter = Router();

authRouter
  .post(
    "/auth/login",
    authValidators,
    inputValidationResultMiddleware,
    loginUserController
  )
  .get("/auth/login/me");
