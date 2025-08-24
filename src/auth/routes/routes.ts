import { Router } from "express";
import { authValidators } from "../middlewares/auth.validation";
import { loginUserController } from "../controller/auth.userController";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { getInfoAboutUserController } from "../controller/get.info.aboutUserController";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { userValidators } from "../../users/middlewares/user-input-dto-validator";
import { registrationUserController } from "../controller/registration.userController";
export const authRouter = Router();

authRouter
  .post(
    "/auth/login",
    authValidators,
    inputValidationResultMiddleware,
    loginUserController,
  )
  .get("/auth/me", accessTokenGuard, getInfoAboutUserController)
  .post(
    "/auth/registration",
    userValidators,
    inputValidationResultMiddleware,
    registrationUserController,
  );
