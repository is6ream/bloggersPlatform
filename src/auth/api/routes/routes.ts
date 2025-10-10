import { Router } from "express";
import {
  authValidators,
  codeValidator,
} from "../../middlewares/auth.validation";
import { authUserController } from "../controllers/auth.userController";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { accessTokenGuard } from "../../../core/guards/access.token.guard";
import {
  emailValidator,
  userValidators,
} from "../../../users/middlewares/user-input-dto-validator";
import { refreshTokenGuard } from "../../../core/guards/refreshTokenGuard";
import { customRateLimitMiddleware } from "../../../securityDevices/customRateLimit/customRateLimitMiddleware";

export const authRouter = Router();

authRouter
  .post(
    "/login",
    customRateLimitMiddleware,
    authValidators,
    inputValidationResultMiddleware,
    authUserController.loginUser.bind(authUserController),
  )
  .get(
    "/me",
    accessTokenGuard,
    authUserController.getInfoAboutUser.bind(authUserController),
  )
  .post(
    "/registration",
    customRateLimitMiddleware,
    userValidators,
    inputValidationResultMiddleware,
    authUserController.registrationUser.bind(authUserController),
  )
  .post(
    "/registration-email-resending",
    customRateLimitMiddleware,
    emailValidator,
    inputValidationResultMiddleware,
    authUserController.emailResending.bind(authUserController),
  )
  .post(
    "/registration-confirmation",
    customRateLimitMiddleware,
    codeValidator,
    inputValidationResultMiddleware,
    authUserController.confirmRegisterUser.bind(authUserController),
  )
  .post(
    "/refresh-token",
    refreshTokenGuard,
    authUserController.refreshToken.bind(authUserController),
  )
  .post(
    "/logout",
    refreshTokenGuard,
    authUserController.logout.bind(authUserController),
  );
