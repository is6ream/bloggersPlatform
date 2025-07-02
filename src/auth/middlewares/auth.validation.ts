import { body } from "express-validator";
import { authColletction } from "../../db/mongo.db";

const combinedRegex = /^(?:[a-zA-Z0-9_-]*|[\w.-]+@([\w-]+\.)+[\w-]{2,4})$/;

export const loginOrEmailValidator = body("loginOrEmail")
  .trim()
  .notEmpty()
  .withMessage("Требуется логин или email")
  .matches(combinedRegex)
  .withMessage("input must be string or email")
  .isLength({ min: 3, max: 20 })
  .withMessage("More then 20 or 3");
//вопрос, как реализовать эту аавторизацию

export const passwordValidation = body("password")
  .exists()
  .withMessage("field password is required")
  .isString()
  .withMessage("field password must be a string")
  .isLength({ min: 6, max: 20 })
  .withMessage("more then 20 or 6");

export const authValidators = [loginOrEmailValidator, passwordValidation];
