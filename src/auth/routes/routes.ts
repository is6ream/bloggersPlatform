import { Router } from "express";
import { authValidators, codeValidator } from "../middlewares/auth.validation";
import { loginUserController } from "../controller/auth.userController";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { getInfoAboutUserController } from "../controller/get.info.aboutUserController";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import {
  emailValidator,
  userValidators,
} from "../../users/middlewares/user-input-dto-validator";
import { registrationUserController } from "../controller/registration.userController";
import { confirmRegisterUserController } from "../controller/registration.confirmation.userController";
import { emailResendingController } from "../controller/email.resending.controller";
export const authRouter = Router();

authRouter
  .post(
    "/login",
    authValidators,
    inputValidationResultMiddleware,
    loginUserController
  )
  .get("/me", accessTokenGuard, getInfoAboutUserController)
  .post(
    "/registration",
    userValidators,
    inputValidationResultMiddleware,
    registrationUserController
  )
  .post(
    "/registration-email-resending",
    emailValidator,
    inputValidationResultMiddleware,
    emailResendingController
  )
  .post(
    "/registration-confirmation",
    codeValidator,
    inputValidationResultMiddleware,
    confirmRegisterUserController
  );
