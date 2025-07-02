import { body } from "express-validator";

export const loginValidator = body("login")
  .trim()
  .notEmpty()
  .withMessage("Login is required")
  .matches("^[a-zA-Z0-9_-]*$")
  .withMessage("input must be a string")
  .isLength({ min: 3, max: 10 })
  .withMessage("More then 10 or 3");

export 
