import { Response } from "express";
import { RespositoryNotFoundError } from "./repository-not-found.error";
import { HttpStatus } from "../http-statuses";
import { createErrorMessages } from "../error.utils";
import { DomainError } from "./domain.error";

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof RespositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
        },
      ]),
    );
    return;
  }

  if (error instanceof DomainError) {
    const httpsStatus = HttpStatus.UnprocessableEntity;

    res.status(httpsStatus).send(
      createErrorMessages([
        {
          status: httpsStatus,
          source: error.source,
          detail: error.message,
          code: error.code,
        },
      ]),
    );
    return;
  }
  res.status(HttpStatus.InternalServerError);
  return;
}
