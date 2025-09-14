import { ResultStatus } from "./resultCode";
import { Result } from "./result.type";

export const handleSuccessResult = <T>(data: T): Result<T> => {
  return {
    data,
    status: ResultStatus.Success,
    extensions: [],
  };
};

export const handleForbiddenResult = (
  message: string,
  field: string,
): Result<null> => {
  return {
    status: ResultStatus.Forbidden,
    extensions: {
      errorsMessages: [{ message: message, field: field }],
    },
    data: null,
  };
};

export const handleNotFoundResult = (
  message: string,
  field: string,
): Result<null> => {
  return {
    status: ResultStatus.NotFound,
    extensions: {
      errorsMessages: [{ message: message, field: field }],
    },
    data: null,
  };
};
export const handleBadRequestResult = (
  message: string,
  field: string,
): Result<null> => {
  return {
    status: ResultStatus.BadRequest,
    extensions: {
      errorsMessages: [{ message: message, field: field }],
    },
    data: null,
  };
};
