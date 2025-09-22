import { Router } from "express";
import { authValidators, codeValidator } from "../middlewares/auth.validation";
import { loginUserController } from "./controllers/auth.userController";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { getInfoAboutUserController } from "./controllers/get.info.aboutUserController";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import {
  emailValidator,
  userValidators,
} from "../../users/middlewares/user-input-dto-validator";
import { registrationUserController } from "./controllers/registration.userController";
import { confirmRegisterUserController } from "./controllers/registration.confirmation.userController";
import { emailResendingController } from "./controllers/email.resending.controller";
import { refreshTokenGuard } from "../middlewares/refreshTokenGuard";
import { refreshTokenController } from "./controllers/refreshToken.controller";
import { logoutController } from "./controllers/logoutController";
import { customRateLimitMiddleware } from "../../securityDevices/customRateLimit/customRateLimitMiddleware";
export const authRouter = Router();

authRouter
  .post(
    "/login",
    customRateLimitMiddleware,
    authValidators,
    inputValidationResultMiddleware,
    loginUserController,
  )
  .get("/me", accessTokenGuard, getInfoAboutUserController)
  .post(
    "/registration",
    customRateLimitMiddleware,
    userValidators,
    inputValidationResultMiddleware,
    registrationUserController,
  )
  .post(
    "/registration-email-resending",
    customRateLimitMiddleware(),
    emailValidator,
    inputValidationResultMiddleware,
    emailResendingController,
  )
  .post(
    "/registration-confirmation",
    customRateLimitMiddleware(),
    codeValidator,
    inputValidationResultMiddleware,
    confirmRegisterUserController,
  )
  .post("/refresh-token", refreshTokenGuard, refreshTokenController)
  .post("/logout", refreshTokenGuard, logoutController);
