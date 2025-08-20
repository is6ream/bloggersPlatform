import { body } from "express-validator";

export const commentValidator = body("content")
  .exists()
  .withMessage("Comment is required")
  .bail()
  .isString()
  .withMessage("Comment must be a string")
  .bail()
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("Comment must be between 20 and 300 characters");
