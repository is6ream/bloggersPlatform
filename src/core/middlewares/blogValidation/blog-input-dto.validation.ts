import { body } from "express-validator";

export const nameValidator = body("name")
  .exists()
  .withMessage("name is required")
  .bail()
  .isString()
  .withMessage("name must be a string")
  .bail()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("more than 15 or 0")
  .bail();

export const descriptionValidator = body("description")
  .exists()
  .withMessage("description is required")
  .bail()
  .isString()
  .withMessage("description must be a string")
  .bail()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("more than 500 or 0")
  .bail();

export const websiteUrlValidator = body("websiteUrl")
  .isString()
  .withMessage("not string")
  .bail()
  .trim()
  .isURL()
  .withMessage("not url")
  .bail()
  .isLength({ min: 1, max: 100 })
  .withMessage("more then 100 or 0")
  .bail();

export const blogValidators = [
  websiteUrlValidator,
  nameValidator,
  descriptionValidator,
];
