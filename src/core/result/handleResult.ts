import { ResultStatus } from "./resultCode";

export type Result<T> = {
  data: T;
  resultCode: ResultStatus;
  errorMessages?: string;
};

export const handleSuccessResult = <T>(data: T): Result<T> => {
  return {
    data,
    resultCode: ResultStatus.Success,
  };
};

export const handleForbiddenResult = (message: string): Result<null> => {
  return {
    data: null,
    resultCode: ResultStatus.Forbidden,
    errorMessages: message,
  };
};

export const handleNotFoundResult = (message: string): Result<null> => {
  return {
    data: null,
    resultCode: ResultStatus.NotFound,
    errorMessages: message,
  };
};
