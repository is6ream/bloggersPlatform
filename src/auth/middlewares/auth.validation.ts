import { body } from "express-validator";

export const loginOrEmailValidator = body("loginOrEmail")
  .exists()
  .withMessage("field login or email is required")
  .bail()
  .isString()
  .withMessage("field login or email must be a string");

export const passwordValidation = body("password")
  .exists()
  .withMessage("field password is required")
  .bail()
  .isString()
  .withMessage("field password must be a string");

export const authValidators = [loginOrEmailValidator, passwordValidation];
