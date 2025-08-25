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

const codeRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const codeValidator = body("code")
  .exists()
  .withMessage("field code is required")
  .isString()
  .withMessage("field code must be a string")
  .matches(codeRegex)
  .withMessage("code must be UUID string");
