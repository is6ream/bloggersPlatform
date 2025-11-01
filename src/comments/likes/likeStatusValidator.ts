import { body } from "express-validator";

export const likeStatusValidator = body("likeStatus")
  .exists()
  .withMessage("like status is required")
  .bail()
  .isIn(["Node", "Like", "Dislike"])
  .withMessage("Likestatus must be none, like or dislike")
  .bail()
  .isString()
  .withMessage("like status must be a string")
  .bail();
