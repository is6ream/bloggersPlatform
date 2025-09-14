import { ResultStatus } from "./resultCode";

type ExtensionType = {
  errorsMessages: [
    {
      message: string;
      field: string | null;
    },
  ];
};

type RegistrationExtensionType = {
  errorsMessages: [{ message: string; field: string | null }];
};

export type Result<T = null> = {
  status: ResultStatus;
  errorMessage?: string;
  extensions: ExtensionType;
  data?: T;
};

export type RegistrationResult<T = null> = {
  status: ResultStatus;
  errorMessage?: string;
  extensions?: RegistrationExtensionType;
  data?: T;
};
