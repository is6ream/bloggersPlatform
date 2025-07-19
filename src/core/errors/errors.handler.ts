import { descriptionValidator } from "./../middlewares/blogValidation/blog-input-dto.validation";
import { Response } from "express";
import { RepositoryNotFoundError } from "./repository-not-found.error";
import { HttpStatus } from "../http-statuses";
import { createErrorMessages } from "./create-error-message";
import { DomainError } from "./domain.error";
import { create } from "domain";

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          field: error.field, //тут может быть ошибка, из-за неправильного добавления нового свойства
          message: error.message,
        },
      ])
    );
  }
}
