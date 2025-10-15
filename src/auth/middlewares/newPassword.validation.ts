import { body } from "express-validator";

export const newPasswordValidator = body("newPassword")
  .trim()
  .notEmpty()
  .withMessage("Password is required")
  .isString()
  .withMessage("password must be a string")
  .isLength({ min: 6, max: 20 })
  .withMessage("More then 20 or 6");
