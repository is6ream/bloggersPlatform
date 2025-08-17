import { ResultStatus } from "./resultCode";
import { HttpStatus } from "../../core/http-statuses";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.BadRequest:
      return HttpStatus.BadRequest;
    case ResultStatus.Forbidden:
      return HttpStatus.Forbidden;
    case ResultStatus.Unauthorized:
      return HttpStatus.Unauthorized;
    case ResultStatus.NotFound:
      return HttpStatus.NotFound;
    case ResultStatus.Success:
      return HttpStatus.Ok;
    default:
      return HttpStatus.InternalServerError;
  }
};
