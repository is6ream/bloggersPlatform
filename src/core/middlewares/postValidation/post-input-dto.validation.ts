import { body } from "express-validator";

export const titleValidator = body("title")
  .exists()
  .withMessage("title is required")
  .isString()
  .withMessage("title must be a string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("More than 30 or 0");

export const shortDescriptionValidator = body("shortDescription")
  .exists()
  .withMessage("shortDescription is required")
  .isString()
  .withMessage("shortDescription must be a string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("More than 100 or 0");

export const contentValidator = body("content")
  .exists()
  .withMessage("content is required")
  .isString()
  .withMessage("content must be a string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("More than 1000 or 0");

export const blogIdValidator = body("blogId")
  .exists()
  .withMessage("blogId is required")
  .isString()
  .withMessage("blogId must be a string");

export const postValidators = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
];
