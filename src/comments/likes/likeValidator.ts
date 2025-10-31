import { body } from "express-validator";

export const likeStatusValidator = body("like")
  .exists()
  .withMessage("like status is required")
  .bail()
  .isString()
  .withMessage("like status must be a string");
