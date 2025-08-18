import { body } from "express-validator";

export const commentValidator = body("content")
  .exists()
  .withMessage("comment is required")
  .bail()
  .isString()
  .withMessage("comment must be a string")
  .bail()
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("More than 300 or 20")
  .bail();
