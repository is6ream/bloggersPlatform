import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from "express-validator";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../http-statuses";
import { ValidationErrorDto } from "../../types/validation/validationError.dto";
import { ValidationErrorType } from "../../types/validation/validationError";

export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorDto => {
  return {
    errorMessages: errors.map((error) => ({
      field: error.field,
      message: error.message,
    })),
  };
};

export const formatErrors = (error: ValidationError): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    message: expressError.msg,
    field: expressError.path,
  };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
    return;
  }
  next();
};
