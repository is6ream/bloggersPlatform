import { body } from "express-validator";

export const likeStatusValidator = body("likeStatus")
  .exists()
  .withMessage("like status is required")
  .bail()
  .isIn(["None", "Like", "Dislike"])
  .withMessage("Like status must be none, like or dislike")
  .bail()
  .isString()
  .withMessage("like status must be a string")
  .bail();
