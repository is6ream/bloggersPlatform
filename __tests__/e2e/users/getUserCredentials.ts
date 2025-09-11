import { UserInputModel } from "../../../src/users/types/user-types";

export function getUserCredentials(credentials?: {
  login: string;
  password: string;
  email: string;
}): UserInputModel {
  if (credentials) {
    return {
      login: credentials.login,
      password: credentials.password,
      email: credentials.email,
    };
  } else
    return {
      login: "1ur7HVXyxH",
      password: "string",
      email: "example@example.com",
    };
}
