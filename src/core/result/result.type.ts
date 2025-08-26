import { ResultStatus } from "./resultCode";

type ExtensionType = {
  field: string | null;
  message: string;
};

type RegistrationExtensionType = errorMessages:[ {
  field: string | null;
  message: string;
};]

export type Result<T = null> = {
  status: ResultStatus;
  errorMessage?: string;
  extensions: ExtensionType[];
  data?: T;
};

export type RegistrationResult<T = null> = {
  status: ResultStatus;
  errorMessage?:string,
  extensions: 
};
