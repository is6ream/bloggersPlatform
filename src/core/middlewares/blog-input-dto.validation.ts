import { body } from "express-validator";

export const nameValidator = body("name")
  .exists()
  .withMessage("name is required")
  .isString()
  .withMessage("name must be a string")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("more than 15 or 0");

export const descriptionValidator = body("description")
  .exists()
  .withMessage("description is required")
  .isString()
  .withMessage("description must be a string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("more than 500 or 0");

export const websiteUrlValidator = body("websiteUrl")
  .isString()
  .withMessage("not string")
  .trim()
  .isURL()
  .withMessage("not url")
  .isLength({ min: 1, max: 100 })
  .withMessage("more then 100 or 0");

export const blogValidators = [
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
];
