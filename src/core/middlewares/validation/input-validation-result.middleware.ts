import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ValidationErrorType } from "../../types/validationError";
import { HttpStatus } from "../../http-statuses";
import { ValidationErrorDto } from "../../types/validationError.dto";
