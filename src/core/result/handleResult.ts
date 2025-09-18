import { ResultStatus } from "./resultCode";
import { Result } from "./result.type";

export const handleSuccessResult = <T>(data?: T): Result<T> => {
  return {
    data,
    status: ResultStatus.Success,
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

export const handleUnauthorizedFResult = (
  message: string,
  field: string,
): Result<null> => {
  return {
    status: ResultStatus.Unauthorized,
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
export const handleBadRequestResult = <T>(
  message: string,
  field: string,
): Result<T> => {
  return {
    status: ResultStatus.BadRequest,
    extensions: {
      errorsMessages: [{ message, field }],
    },
    data: null as unknown as T,
  };
};
