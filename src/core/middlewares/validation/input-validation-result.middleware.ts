import { validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../types";

const formatErrors = (error: ValidationError) => ({
  message: error.msg,
  field: "path" in error ? error.path : "unknown",
});

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req).formatWith(formatErrors).array();

  if (errors.length) {
    res.status(HttpStatus.BadRequest).send({ errorsMessages: errors });
  }
  next();
};
