export type AuthAttributes = {
  loginOrEmail: string;
  passwordHash: string;
};

export type AuthCreateInput = AuthAttributes;

export type AuthDto = {
  loginOrEmail: string;
  password: string;
};

export type TestUserCredentials = {
  login: string;
  password: string;
  email: string;
};
