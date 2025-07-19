import { Response } from "express";
import { RepositoryNotFoundError } from "./repository-not-found.error";
import { HttpStatus } from "../http-statuses";
import { createErrorMessages } from "./create-error-message";
import { DomainError } from "./domain.error";
import { create } from "domain";

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;

    res.status(httpStatus).send(createErrorMessages([
        {
            message: error.message,
            field: 
        }]));
  }
}
