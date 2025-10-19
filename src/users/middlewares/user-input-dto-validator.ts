import { body } from "express-validator";

export const loginValidator = body("login")
  .trim()
  .notEmpty()
  .withMessage("Login is required")
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("input must be a string")
  .isLength({ min: 3, max: 10 })
  .withMessage("More then 10 or 3")
  .bail();

export const passwordValidator = body("password")
  .exists()
  .withMessage("field password is required")
  .isString()
  .withMessage("field password must be a string")
  .isLength({ min: 6, max: 20 })
  .withMessage("more then 20 or 6")
  .bail();

export const emailValidator = body("email")
  .exists()
  .withMessage("field email is required")
  .isString()
  .withMessage("field email must be a string")
  .matches(/^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("input must be a email");
export const userValidators = [
  loginValidator,
  passwordValidator,
  emailValidator,
];
