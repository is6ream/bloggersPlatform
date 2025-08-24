import { loginValidator } from './../../users/middlewares/user-input-dto-validator';
import { body } from "express-validator";

const combinedRegex = /^(?:[a-zA-Z0-9_-]*|[\w.-]+@([\w-]+\.)+[\w-]{2,4})$/;

export const loginOrEmailValidator = body("loginOrEmail")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("input must be a string")
  .withMessage("Login or email is required")
  .matches(combinedRegex)
  .withMessage("input must be string or email")
  .isLength({ min: 3, max: 20 })
  .withMessage("More then 20 or 3");

export const passwordValidation = body("password")
  .exists()
  .withMessage("field password is required")
  .isString()
  .withMessage("field password must be a string")
  .isLength({ min: 6, max: 20 })
  .withMessage("more then 20 or 6");

export const authValidators = [loginOrEmailValidator, passwordValidation];


