import { param } from "express-validator";

const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;

//для route параметров

export const idValidation = param("id")
  .exists()
  .withMessage("Id is required")
  .trim()
  .notEmpty()
  .matches(ObjectIdRegex)
  .withMessage("Invalid ObjectId format");
