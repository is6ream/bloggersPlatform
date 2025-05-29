import { validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";

const formatErrors = (error: ValidationError) => ({
  field: error.type,
  message: error.msg,
});

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req).formatWith(formatErrors).array();

  if (errors.length) {
    return res.status(400).json({ errorsMessages: errors });
  }
  next();
};
